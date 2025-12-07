# -*- coding: utf-8 -*-

import RPi.GPIO as GPIO
from time import sleep

# 모터 상태
STOP    = 0
FORWARD = 1
BACKWORD = 2

# 모터 채널
CH1 = 0  # 오른쪽
CH2 = 1  # 왼쪽

HIGH = 1
LOW  = 0

# =========================
# 모터 실제 핀 정의 (네가 준 코드 그대로)
# =========================
# PWM PIN
ENA = 26 
ENB = 0  

# GPIO PIN
IN1 = 25
IN2 = 8  
IN3 = 1 
IN4 = 7  

# =========================
# 3채널 라인트레이서 모듈 핀 (예시, 반드시 실제 핀으로 수정)
# =========================
LS_LEFT   = 5    # 왼쪽 센서 (BCM 5 예시)
LS_CENTER = 6    # 중앙 센서 (BCM 6 예시)
LS_RIGHT  = 13   # 오른쪽 센서 (BCM 13 예시)

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
BASE_SPEED_RIGHT = 46  # 오른쪽 바퀴 기본 속도
BASE_SPEED_LEFT  = 50  # 왼쪽 바퀴 기본 속도

# 미세 보정용 (가드라인 가까워졌을 때)
ADJUST_DELTA = 15      # 보정 강도 (원하면 10~20 사이로 바꿔보기)


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
    elif stat == BACKWORD:
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
    return left, center, right


def is_inside_corridor(left, center, right):
    """
    000 이면 가드라인 안쪽이라고 정의.
    (양쪽 선이 센서 범위 밖에 있고, 가운데 흰 영역만 보는 구조)
    """
    return (left == SPACE) and (center == SPACE) and (right == SPACE)


def is_node_pattern(left, center, right):
    """
    노드 패턴 정의:
    000 이 평소/가드라인 안,
    노드마다 중앙 센서만 선을 밟게 그릴 거라면: 010 패턴 사용.
    필요하면 111 같은 것도 추가로 노드로 인식 가능.
    """
    # 010 패턴: 중앙만 선을 감지
    if (left == SPACE) and (center == LINE) and (right == SPACE):
        return True

    # 만약 노드에서 세 개 다 선을 밟게 그릴 거라면 아래도 허용
    if (left == LINE) and (center == LINE) and (right == LINE):
        return True

    return False


def handle_node(node_index):
    """
    노드별 행동 정의하는 곳.
    예: 1번 노드에서 좌회전, 2번 노드에서 우회전, 3번에서 정지 등등.
    """
    print(f"[NODE] 노드 {node_index} 진입 - 방향 탐색(제자리 회전) 시작")

    # 제자리 회전 (예: 왼쪽으로 회전)
    # CH1(우) 전진, CH2(좌) 후진
    # 속도는 적절히 설정 (너무 빠르면 000을 놓칠 수 있음)
    SEARCH_SPEED = 45
    setMotor(CH1, SEARCH_SPEED, FORWARD)
    setMotor(CH2, SEARCH_SPEED, BACKWORD)

    # 000 (가드라인 안쪽)이 될 때까지 대기
    while True:
        left, center, right = read_line_sensors()
        if is_inside_corridor(left, center, right):
            print("[NODE] 길 찾음 (000 감지) - 회전 중지")
            break
        sleep(0.01)
    
    # 회전 멈춤
    setMotor(CH1, 0, STOP)
    setMotor(CH2, 0, STOP)
    sleep(0.2) # 잠시 안정화


def line_follow_with_nodes():
    node_count = 0
    in_node = False  # 노드 안에 있는 중인지 플래그

    while True:
        left, center, right = read_line_sensors()
        # 디버깅용
        print(f"L={left}, C={center}, R={right}")

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
            setMotor(CH1, BASE_SPEED_RIGHT // 2, FORWARD)
            setMotor(CH2, BASE_SPEED_LEFT // 2, FORWARD)

        else:
            # 노드 영역에서 나가면 플래그 해제
            in_node = False

            # 2) 평소 주행: 000 = 가드라인 안쪽
            if is_inside_corridor(left, center, right):
                setMotor(CH1, BASE_SPEED_RIGHT, FORWARD)
                setMotor(CH2, BASE_SPEED_LEFT, FORWARD)

            # 3) 왼쪽 센서가 선을 감지 → 왼쪽 가드라인에 가까워짐 → 오른쪽으로 살짝 틀기
            elif (left == LINE) and (right == SPACE):
                # 오른쪽으로 보정: 왼쪽 속도 ↑, 오른쪽 속도 ↓
                print("Turn Right (Left sensor hit)")
                setMotor(CH1, BASE_SPEED_RIGHT - ADJUST_DELTA, FORWARD)
                setMotor(CH2, BASE_SPEED_LEFT  + ADJUST_DELTA, FORWARD)

            # 4) 오른쪽 센서가 선을 감지 → 오른쪽 가드라인에 가까워짐 → 왼쪽으로 살짝 틀기
            elif (right == LINE) and (left == SPACE):
                # 왼쪽으로 보정: 오른쪽 속도 ↑, 왼쪽 속도 ↓
                print("Turn Left (Right sensor hit)")
                setMotor(CH1, BASE_SPEED_RIGHT + ADJUST_DELTA, FORWARD)
                setMotor(CH2, BASE_SPEED_LEFT  - ADJUST_DELTA, FORWARD)

            # 5) 그 외 애매한 패턴(한쪽/양쪽 다 선 밟고 있음 등) → 일단 감속/정지
            else:
                setMotor(CH1, 0, STOP)
                setMotor(CH2, 0, STOP)

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
