# -*- coding: utf-8 -*-
"""Backward-compatible shim.

service_handler now uses raspi/rc_car/line_sensor.py directly.
This file remains to avoid breaking old imports.
"""

from line_sensor import *
# 모터 상태
STOP     = 0
FORWARD  = 1
BACKWARD = 2

# 모터 채널
CH1 = 0  # 오른쪽
CH2 = 1  # 왼쪽

HIGH = 1
LOW  = 0

# =========================
# 모터 실제 핀 정의
# =========================
# PWM PIN
ENA = 12 
ENB = 13  

# GPIO PIN
IN1 = 25
IN2 = 8  
IN3 = 24 
IN4 = 23 

# =========================
# 3채널 라인트레이서 모듈 핀 (예시, 반드시 실제 핀으로 수정)
# =========================
LS_LEFT   = 5    # 왼쪽 센서 (BCM 5 예시)
LS_CENTER = 6    # 중앙 센서 (BCM 6 예시)
LS_RIGHT  = 22   # 오른쪽 센서 (BCM 13 예시)

# =========================
# 센서 출력 논리
# =========================
# 보통 라인트레이서 모듈은:
#   - 검정 선: LOW(0)
#   - 흰 바닥: HIGH(1)
# 라고 가정.
# 만약 반대라면 LINE/SPACE 값을 1/0 으로 바꿔줘라.
LINE  = 0   # 선(검정) 감지
SPACE = 1   # 바닥(선 없음)

# =========================
# 속도 설정
# =========================
BASE_SPEED_RIGHT = 62  # 오른쪽 바퀴 기본 속도
BASE_SPEED_LEFT  = 65  # 왼쪽 바퀴 기본 속도

###########################################
# 간단한 보정 기반 주행 (PID 미사용)
###########################################


def setPinConfig(EN, INA, INB):        
    GPIO.setup(EN, GPIO.OUT)
    GPIO.setup(INA, GPIO.OUT)
    GPIO.setup(INB, GPIO.OUT)

    pwm = GPIO.PWM(EN, 100) 
    pwm.start(0)
    return pwm


def setMotorControl(pwm, INA, INB, speed, stat):
    # 속도 클램프
    if speed < 0:
        speed = 0
    if speed > 100:
        speed = 100

    pwm.ChangeDutyCycle(speed)

    if stat == FORWARD:
        GPIO.output(INA, HIGH)
        GPIO.output(INB, LOW)
    elif stat == BACKWARD:
        GPIO.output(INA, LOW)
        GPIO.output(INB, HIGH)
    elif stat == STOP:
        GPIO.output(INA, LOW)
        GPIO.output(INB, LOW)


def setMotor(ch, speed, stat):
    if ch == CH1:
        setMotorControl(pwmA, IN1, IN2, speed, stat)
    else:
        setMotorControl(pwmB, IN3, IN4, speed, stat)


# ============== 라인트레이서 관련 ==============

def setup_line_tracer():
    GPIO.setup(LS_LEFT, GPIO.IN)
    GPIO.setup(LS_CENTER, GPIO.IN)
    GPIO.setup(LS_RIGHT, GPIO.IN)


def read_line_sensors():
    left   = GPIO.input(LS_LEFT)
    center = GPIO.input(LS_CENTER)
    right  = GPIO.input(LS_RIGHT)
            # 디버깅용
    # print(f"L={left}, C={center}, R={right}")
    return left, center, right


def calculate_line_position(left, center, right):
    """
    센서 값으로 라인 위치 계산
    실제 센서 패턴:
    - 가드라인 안: L=0, C=0, R=0 (모두 선) → 위치=0
    - 왼쪽 경계: L=0, C=1, R=1 (좌측만 선) → 위치=-1
    - 오른쪽 경계: L=1, C=1, R=0 (우측만 선) → 위치=+1
    - 중앙: L=0, C=1, R=0 → 위치=0 (노드)
    
    반환값: -1(왼쪽) ~ 0(중앙) ~ +1(오른쪽)
    """
    position = 0
    
    # 왼쪽 센서만 선 감지 (경계에 가까움)
    if left == LINE and center == SPACE and right == SPACE:
        position = -1
    # 오른쪽 센서만 선 감지 (경계에 가까움)
    elif left == SPACE and center == SPACE and right == LINE:
        position = 1
    # 중앙 센서만 선 감지 (중앙/노드)
    elif left == SPACE and center == LINE and right == SPACE:
        position = 0
    # 왼쪽 경계 (L,C 선 감지)
    elif left == LINE and center == LINE and right == SPACE:
        position = -0.5
    # 오른쪽 경계 (C,R 선 감지)
    elif left == SPACE and center == LINE and right == LINE:
        position = 0.5
    # 모두 선 감지 (중앙)
    elif left == LINE and center == LINE and right == LINE:
        position = 0
    # 모두 비어있음 (가드라인 안)
    elif left == SPACE and center == SPACE and right == SPACE:
        position = 0
    
    return position


def apply_simple_correction(position):
    """
    센서 위치(-1~1)로부터 단순한 속도 보정값을 계산한다.
    멀리 치우칠수록 보정폭을 크게 적용한다.
    """
    right_speed = BASE_SPEED_RIGHT
    left_speed = BASE_SPEED_LEFT

    if position <= -0.7:
        right_speed += 22
        left_speed -= 22
    elif position <= -0.2:
        right_speed += 12
        left_speed -= 12
    elif position >= 0.7:
        right_speed -= 22
        left_speed += 22
    elif position >= 0.2:
        right_speed -= 12
        left_speed += 12

    right_speed = max(20, min(100, right_speed))
    left_speed = max(20, min(100, left_speed))

    return right_speed, left_speed


def is_inside_corridor(left, center, right):
    """
    가드라인 안쪽 판단
    L=0,C=0,R=0 또는 L=1,C=1,R=1이면 가드라인 안
    """
    return ((left == SPACE) and (center == SPACE) and (right == SPACE)) or \
           ((left == LINE) and (center == LINE) and (right == LINE))


def is_node_pattern(left, center, right):
    """
    노드 패턴 정의:
    - 111: 세 센서 모두 라인 감지 시 '노드'로 인식
    - 000: 평소/가드라인 안, 노드 아님
    - 010 등 부분 감지는 노드로 인식하지 않음
    """
    return (left == LINE) and (center == LINE) and (right == LINE)


# 🗺️ 테스트용 하드코딩 경로 (수정 가능)
TEST_ROUTE = {
    1: "straight",  # 입구 -> 기점1
    # 2: "left",      # 기점1 -> 기점2 (예시)
    # 3: "straight",     # 기점2 -> ...
    # 4: "right",
    # 5: "left",
    # 6: "stop"# 목적지
}

def turn_left():
    print("⬅️ 좌회전 실행")
    # 1. 교차점 벗어날 때까지 살짝 전진
    setMotor(CH1, BASE_SPEED_RIGHT, FORWARD)
    setMotor(CH2, BASE_SPEED_LEFT, FORWARD)
    
    # 2. 제자리 회전 (좌회전: 우측 전진, 좌측 후진)
    setMotor(CH1, BASE_SPEED_RIGHT, FORWARD)
    setMotor(CH2, BASE_SPEED_LEFT, BACKWARD)
    sleep(0.3) # 90도 돌 때까지 시간 조절 (튜닝 필요)
    
    # 3. 라인 찾기
    while True:
        left, center, right = read_line_sensors()
        if center == SPACE and left == SPACE: # 중앙 센서가 라인 잡으면 정지
            print("회전끝")
            break
            
        
    
    # 4. 잠시 정지 후 출발
    setMotor(CH1, 0, STOP)
    setMotor(CH2, 0, STOP)
    sleep(0.2)

def turn_right():
    print("➡️ 우회전 실행")
    # 1. 교차점 벗어날 때까지 살짝 전진
    setMotor(CH1, BASE_SPEED_RIGHT, FORWARD)
    setMotor(CH2, BASE_SPEED_LEFT, FORWARD)
    
    # 2. 제자리 회전 (우회전: 좌측 전진, 우측 후진)
    setMotor(CH1, BASE_SPEED_RIGHT, BACKWARD)
    setMotor(CH2, BASE_SPEED_LEFT, FORWARD)
    sleep(0.56) # 90도 돌 때까지 시간 조절 (튜닝 필요)
    
    # 3. 라인 찾기
    while True:
        left, center, right = read_line_sensors()
        if center == SPACE and right == SPACE:
            print("회전끝")
            break
        
    # 4. 잠시 정지 후 출발
    setMotor(CH1, 0, STOP)
    setMotor(CH2, 0, STOP)
    sleep(0.2)

def handle_node(node_index):
    """
    노드별 행동 정의하는 곳.
    TEST_ROUTE에 정의된 대로 동작.
    """
    action = TEST_ROUTE.get(node_index, "straight")
    print(f"[NODE] 노드 {node_index} 진입 - 동작: {action}")

    if action == "stop":
        print("🛑 목적지 도착! 정지")
        setMotor(CH1, 0, STOP)
        setMotor(CH2, 0, STOP)
        # 종료를 위해 무한 대기
        while True:
            sleep(1)

    elif action == "left":
        turn_left()

    elif action == "right":
        turn_right()

    elif action == "straight":
        print("⬆️ 직진 통과")
        # 직진은 메인 루프에서 처리하므로 여기서는 아무것도 안 함
        pass


def line_follow_with_nodes():
    node_count = 0
    in_node = False  # 노드 안에 있는 중인지 플래그

    while True:
        left, center, right = read_line_sensors()

        # 1) 노드 패턴인지 먼저 확인
        if is_node_pattern(left, center, right):
            # 노드 진입 순간에만 카운트 증가
            if not in_node:
                node_count += 1
                in_node = True
                handle_node(node_count)
                continue

            # 노드 위에서는 원하는 만큼 속도 조정
            # 여기서는 일단 살짝 감속 직진
            setMotor(CH1, BASE_SPEED_RIGHT * 0.9, FORWARD)
            setMotor(CH2, BASE_SPEED_LEFT * 0.9, FORWARD)

        else:
            # 노드 영역에서 나가면 플래그 해제
            in_node = False

            # 2) 평소 주행: PID 제어 사용
            if is_inside_corridor(left, center, right):
                # 가드라인 안: 직진 + PID 초기화
                setMotor(CH1, BASE_SPEED_RIGHT, FORWARD)
                setMotor(CH2, BASE_SPEED_LEFT, FORWARD)
            else:
                # 라인 위치 계산 및 PID 보정
                position = calculate_line_position(left, center, right)
                
                # 모든 센서가 꺼져 있으면 직진
                if position == 0 and (left == SPACE and center == SPACE and right == SPACE):
                    setMotor(CH1, BASE_SPEED_RIGHT, FORWARD)
                    setMotor(CH2, BASE_SPEED_LEFT, FORWARD)
                else:
                    right_speed, left_speed = apply_simple_correction(position)
                    print(f"Pos={position:.1f}, R={right_speed:.0f}, L={left_speed:.0f}")

                    setMotor(CH1, right_speed, FORWARD)
                    setMotor(CH2, left_speed, FORWARD)

        sleep(0.01)  # 루프 딜레이


# =========================
# 메인
# =========================
if __name__ == "__main__":
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    # 모터 핀 설정
    pwmA = setPinConfig(ENA, IN1, IN2)
    pwmB = setPinConfig(ENB, IN3, IN4)

    # 라인트레이서 설정
    setup_line_tracer()

    print("가드라인(000), 중앙 센서 노드 인식 모드 시작")
    sleep(1)

    try:
        line_follow_with_nodes()
    except KeyboardInterrupt:
        print("사용자 종료")
    finally:
        setMotor(CH1, 0, STOP)
        setMotor(CH2, 0, STOP)
        GPIO.cleanup()
