# -*- coding: utf-8 -*-
"""
RC카 서비스 요청 MQTT 핸들러
백엔드 서버에서 발행한 rccar/{carId}/command 메시지를 구독하고 경로 정보를 처리
키보드 제어로 차량 이동 + 라인트레이싱으로 노드 감지
"""

import json
import time
import threading
try:
    import RPi.GPIO as GPIO  # type: ignore[import-not-found]
except Exception:  # pragma: no cover
    GPIO = None
from time import sleep

import mqtt_gateway

# service_handler에서 필요한 최소 로직만 모듈로 분리한 버전 사용
import motor as kc

forward = kc.forward
stop = kc.stop
turn_left = kc.turn_left
turn_right = kc.turn_right
backward = kc.backward
forward_left = kc.forward_left
forward_right = kc.forward_right
setPinConfig = kc.setPinConfig
setMotor = kc.setMotor
get_key = kc.get_key
CH1 = kc.CH1
CH2 = kc.CH2
FORWARD = kc.FORWARD
STOP = kc.STOP
ENA = kc.ENA
ENB = kc.ENB
IN1 = kc.IN1
IN2 = kc.IN2
IN3 = kc.IN3
IN4 = kc.IN4

from line_sensor import setup_line_tracer, read_line_sensors, is_node_pattern

MQTT_CONFIG = mqtt_gateway.DEFAULT_CONFIG
# ==========================================
# MQTT 설정
# ==========================================
BROKER_ADDRESS = "192.168.14.69"  # application.yaml의 MQTT 브로커 주소
PORT = 1883
SUBSCRIBE_TOPIC_COMMAND = "rccar/+/command"  # 경로 명령 구독
SUBSCRIBE_TOPIC_SERVICE = "rccar/+/service"   # 서비스 완료 신호 구독
SUBSCRIBE_TOPIC_CALL = "rccar/+/call"         # 차량 호출 신호 구독
CLIENT_ID = "rc_car_service_handler"

# ==========================================
# 노드 ID와 이름 매핑 (data.sql 기준)
# ==========================================
NODE_NAMES = {
    1: "입구",
    2: "기점_1",
    3: "기점_2",
    4: "기점_3",
    5: "주차_1",
    6: "기점_4",
    7: "주차_2",
    8: "기점_5",
    9: "주차_3",
    10: "세차_1",
    12: "기점_6",
    13: "정비_1",
    14: "기점_7",
    15: "기점_8",
    16: "기점_9",
    17: "기점_10",
    18: "기점_11",
    19: "기점_12",
    20: "출구",
    21: "기점_13",
    22: "기점_14",
    23: "기점_15",
}

# 건물 밖을 나타내는 가상 노드 (출구 이후 마지막 위치 표시용)
OUTSIDE_NODE_ID = 0
NODE_NAMES[OUTSIDE_NODE_ID] = "건물 밖"

# 전역 변수
current_route = []
current_work_type = ""
current_car_id = ""
is_running = False
is_waiting_service = False  # 서비스 완료 대기 중인지
is_waiting_call = False     # 호출 대기 중인지
current_route_index = 0     # 현재 경로에서의 인덱스
auto_forward_mode = False   # 자동 전진 모드 (서비스 완료/호출 신호 수신 시)
mqtt_client = None

# GPIO 초기화는 keyboard_control.py와 tracertest.py에서 각각 처리됨
# 여기서는 추가 초기화 불필요


def on_message(client, userdata, message):
    """
    MQTT 메시지 수신 시 처리
    - rccar/{carId}/command: 경로 명령
    - rccar/{carId}/service: 서비스 완료 신호
    - rccar/{carId}/call: 차량 호출 신호
    """
    global current_route, current_work_type, current_car_id
    global is_running, is_waiting_service, is_waiting_call, current_route_index
    global auto_forward_mode, mqtt_client
    
    mqtt_client = client
    
    try:
        topic = message.topic
        payload_str = message.payload.decode("utf-8")
        
        print(f"\n📥 [MQTT 수신] Topic: {topic}")
        print(f"   Payload: {payload_str}")

        # carId 추출
        parts = topic.split("/")
        if len(parts) >= 3 and parts[0] == "rccar":
            car_id = parts[1]
            message_type = parts[2]
        else:
            print("⚠️  올바르지 않은 토픽 형식")
            return

        # 메시지 타입별 처리
        if message_type == "command":
            # 경로 명령 수신
            data = json.loads(payload_str)
            current_route = data.get("route", [])
            current_work_type = data.get("workType", "")
            current_car_id = car_id
            current_route_index = 0
            is_waiting_service = False
            is_waiting_call = False
            auto_forward_mode = False  # 초기 명령은 키보드 조작 모드
            
            print(f"🚗 Car ID: {current_car_id}")
            print(f"🗺️  경로 (노드 ID): {current_route}")
            print(f"🛠️  작업 타입: {current_work_type}")
            
            # 경로 따라 이동 시작
            if not is_running:
                is_running = True
                thread = threading.Thread(target=follow_route_with_node_detection, daemon=True)
                thread.start()
                
        elif message_type == "service":
            # 서비스 완료 신호 수신
            data = json.loads(payload_str)
            stage = data.get("stage", "")
            status = data.get("status", "")
            
            print(f"✅ 서비스 완료 신호 수신: {stage} - {status}")
            
            if status == "done" and is_waiting_service:
                is_waiting_service = False
                auto_forward_mode = True  # 자동 전진 모드 활성화
                
                # 다음 단계로 이동 (주차장으로)
                if "park" in current_work_type:
                    print("🚗 주차장으로 자동 이동 시작")
                    # 주차장 경로는 이미 current_route에 포함되어 있음
                    # 다음 노드부터 계속 진행
                else:
                    # 세차/정비만 선택한 경우 출구로
                    print("🚗 출구로 자동 이동 시작")
                    # 출구 경로 계산 (현재 위치에서 출구까지)
                    # 간단하게 마지막 노드가 출구(20)인지 확인
                    if current_route and current_route[-1] == 20:
                        # 이미 출구 경로에 있음
                        pass
                    else:
                        # 출구 경로 추가 필요 (간단하게 18, 19, 20 추가)
                        current_route = current_route + [18, 19, 20]
                        current_route_index = len(current_route) - 3
                
                # 자동 전진 시작
                if not is_running:
                    is_running = True
                    thread = threading.Thread(target=follow_route_with_node_detection, daemon=True)
                    thread.start()
                        
        elif message_type == "call":
            # 차량 호출 신호 수신
            data = json.loads(payload_str)
            action = data.get("action", "")
            route = data.get("route", [])
            
            print(f"📞 차량 호출 신호 수신: {action}")
            
            if action == "call" and is_waiting_call:
                is_waiting_call = False
                auto_forward_mode = True  # 자동 전진 모드 활성화
                current_route = route
                current_route_index = 0
                print(f"🚗 출구로 자동 이동 시작: {route}")
                # 출구로 이동 시작
                if not is_running:
                    is_running = True
                    thread = threading.Thread(target=follow_route_with_node_detection, daemon=True)
                    thread.start()
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON 파싱 오류: {e}")
    except Exception as e:
        print(f"❌ 메시지 처리 오류: {e}")


def keyboard_input_handler():
    """
    키보드 입력을 받아서 차량을 조작하는 스레드
    """
    global is_running
    
    print("\n" + "="*50)
    print("🎮 키보드 제어 모드 활성화")
    print("="*50)
    print("방향키 (또는 WASD):")
    print("  ↑ / W : 전진")
    print("  ↓ / S : 후진")
    print("  ← / A : 좌회전")
    print("  → / D : 우회전")
    print("  Q : 전진+좌회전")
    print("  E : 전진+우회전")
    print("  SPACE : 정지")
    print("="*50 + "\n")
    
    try:
        while is_running:
            # 키 입력 대기 (blocking)
            key = get_key()
            
            # 방향키는 3바이트로 들어옴
            if key == '\x1b':  # ESC 시퀀스 시작
                key = get_key()
                if key == '[':
                    key = get_key()
                    if key == 'A':    # 위 화살표
                        forward()
                    elif key == 'B':  # 아래 화살표
                        backward()
                    elif key == 'C':  # 오른쪽 화살표
                        turn_right()
                    elif key == 'D':  # 왼쪽 화살표
                        turn_left()
            
            # 일반 키 입력
            elif key.lower() == 'w':
                forward()
            elif key.lower() == 's':
                backward()
            elif key.lower() == 'a':
                turn_left()
            elif key.lower() == 'd':
                turn_right()
            elif key.lower() == 'q':
                forward_left()
            elif key.lower() == 'e':
                forward_right()
            elif key == ' ':
                stop()
            
            sleep(0.05)  # 키 입력 간격
            
    except Exception as e:
        print(f"❌ 키보드 입력 처리 중 오류: {e}")
        import traceback
        traceback.print_exc()
    finally:
        stop()


def follow_route_with_node_detection():
    """
    사용자가 키보드로 조작하거나 자동 전진 모드로 라인트레이싱으로 노드 감지
    """
    global current_route, current_car_id, is_running
    global current_route_index, is_waiting_service, is_waiting_call
    global auto_forward_mode, mqtt_client
    awaiting_outside = False  # 출구 통과 후 건물 밖 노드 감지 대기
    
    try:
        if GPIO is None:
            raise RuntimeError("RPi.GPIO is required to run this on Raspberry Pi")
        # GPIO 초기화 (한 번만)
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        
        # 모터 초기화 (keyboard_control 모듈의 전역 변수에 할당)
        # keyboard_control의 setMotor 함수가 pwmA, pwmB를 사용하므로 여기서 초기화
        if kc.pwmA is None or kc.pwmB is None:
            kc.pwmA = setPinConfig(ENA, IN1, IN2)
            kc.pwmB = setPinConfig(ENB, IN3, IN4)
            print("✅ 모터 초기화 완료")
        
        # 라인트레이서 초기화
        setup_line_tracer()
        print("✅ 라인트레이서 초기화 완료")
        
        # 자동 전진 모드가 아닐 때만 키보드 입력 처리 스레드 시작
        if not auto_forward_mode:
            keyboard_thread = threading.Thread(target=keyboard_input_handler, daemon=True)
            keyboard_thread.start()
            print("✅ 키보드 입력 스레드 시작")
        else:
            print("✅ 자동 전진 모드 활성화")
            # 자동 전진 시작
            forward()
        
        # 현재 목표 노드
        # 초기에는 건물 밖에 있으므로 target_node_id는 None
        # 첫 번째 노드를 감지하면 그때부터 경로를 따라감
        target_node_id = None
        
        node_count = 0
        in_node = False
        is_first_node = True  # 첫 번째 노드 감지 여부
        
        if auto_forward_mode:
            print(f"\n🚀 자동 전진 모드: 경로 따라 이동 시작")
        else:
            print(f"\n🚀 경로 따라 이동 시작 (키보드로 조작하세요)")
        print(f"   현재 위치: 건물 밖")
        if current_route:
            print(f"   첫 번째 목표: {current_route[0]} ({NODE_NAMES.get(current_route[0], '알 수 없음')})")
        
        while is_running and (is_first_node or target_node_id is not None or awaiting_outside):
            # 자동 전진 모드일 때만 자동으로 전진
            if auto_forward_mode:
                # 노드가 아닐 때 전진 유지
                if not in_node:
                    forward()
            
            # 라인트레이서로 노드 감지
            left, center, right = read_line_sensors()
            
            # 노드 패턴 감지
            if is_node_pattern(left, center, right):
                if not in_node:
                    # 노드 진입
                    in_node = True
                    node_count += 1
                    
                    # 첫 번째 노드인 경우
                    if is_first_node:
                        if current_route and current_route_index < len(current_route):
                            expected_node = current_route[current_route_index]
                            node_name = NODE_NAMES.get(expected_node, f"노드_{expected_node}")
                            
                            print(f"\n📍 첫 번째 노드 감지: {expected_node} ({node_name})", flush=True)
                            
                            # 잠시 정지
                            stop()
                            sleep(0.5)
                            
                            # 위치 발행
                            publish_position(mqtt_client, current_car_id, expected_node, node_name)
                            
                            # 첫 번째 노드 감지 완료
                            is_first_node = False
                            
                            # 다음 노드로 이동
                            current_route_index += 1
                            if current_route_index < len(current_route):
                                target_node_id = current_route[current_route_index]
                                print(f"   다음 목표: {target_node_id} ({NODE_NAMES.get(target_node_id, '알 수 없음')})")
                            else:
                                # 첫 번째 노드가 마지막 노드인 경우 (이론적으로는 발생하지 않아야 함)
                                target_node_id = None
                            
                            # 자동 전진 모드일 때 자동으로 전진 재개
                            if auto_forward_mode:
                                sleep(0.3)
                                forward()
                            else:
                                sleep(0.3)
                        continue
                    
                    # 현재 노드 ID 확인 (경로에서 예상되는 노드)
                    if current_route_index < len(current_route):
                        expected_node = current_route[current_route_index]
                        node_name = NODE_NAMES.get(expected_node, f"노드_{expected_node}")
                        
                        print(f"\n\n📍 노드 감지: {expected_node} ({node_name})", flush=True)
                        
                        # 잠시 정지
                        stop()
                        sleep(0.5)
                        
                        # 위치 발행
                        publish_position(mqtt_client, current_car_id, expected_node, node_name)
                        
                        # 목적지 확인
                        if current_route_index == len(current_route) - 1:
                            # 마지막 노드 도착
                            print(f"\n🎯 목적지 도착: {node_name}", flush=True)
                            
                            # 작업 타입에 따라 대기
                            if "park" in current_work_type and node_name.startswith("주차_"):
                                # 주차장 도착 - 호출 대기
                                print("\n⏳ 차량 호출 대기 중...", flush=True)
                                is_waiting_call = True
                                auto_forward_mode = False  # 자동 전진 모드 해제
                                is_running = False
                                stop()
                                break
                            elif node_name.startswith("세차_") or node_name.startswith("정비_"):
                                # 세차/정비 구역 도착 - 서비스 완료 대기
                                print("\n⏳ 서비스 완료 대기 중...", flush=True)
                                is_waiting_service = True
                                auto_forward_mode = False  # 자동 전진 모드 해제
                                is_running = False
                                stop()
                                break
                            elif node_name == "출구":
                                # 출구 도착: 출구 이후 실제 건물 밖 노드까지 진행 후 종료
                                print("\n🚪 출구 도착 - 건물 밖으로 이동 중...", flush=True)
                                awaiting_outside = True
                                auto_forward_mode = True  # 출구 이후는 자동 전진 유지
                                # 다음 감지되는 노드를 건물 밖으로 간주
                                # target_node_id는 더 이상 사용하지 않음
                                target_node_id = None
                                sleep(0.3)
                                forward()
                                # 계속 루프 진행하여 다음 노드 감지 대기
                        else:
                            # 다음 노드로 이동
                            current_route_index += 1
                            if current_route_index < len(current_route):
                                target_node_id = current_route[current_route_index]
                                print(f"\n   다음 목표: {target_node_id} ({NODE_NAMES.get(target_node_id, '알 수 없음')})", flush=True)
                            else:
                                # 경로 끝에 도달 (이론적으로는 발생하지 않아야 함)
                                print("⚠️  경로 인덱스 오류: 경로 끝에 도달")
                                target_node_id = None
                                break
                            
                            # 자동 전진 모드일 때 자동으로 전진 재개
                            if auto_forward_mode:
                                sleep(0.3)  # 노드에서 벗어날 때까지 대기
                                forward()  # 자동 전진 재개
                            else:
                                sleep(0.3)  # 노드에서 벗어날 때까지 대기
            else:
                # 노드 영역에서 나감
                if in_node:
                    in_node = False

            # 출구 이후 '건물 밖' 노드 감지 처리
            if awaiting_outside and in_node:
                # 다음 노드 감지되면 '건물 밖'으로 처리
                stop()
                sleep(0.3)
                # DB에는 nodeId를 NULL로 저장해야 하므로 None 전달
                publish_position(mqtt_client, current_car_id, None, NODE_NAMES[OUTSIDE_NODE_ID])
                print("\n🏁 건물 밖 노드 감지 - 종료", flush=True)
                awaiting_outside = False
                auto_forward_mode = False
                is_running = False
                stop()
                break
            
            sleep(0.05)  # 루프 딜레이
            
    except Exception as e:
        print(f"❌ 경로 따라 이동 중 오류: {e}")
        import traceback
        traceback.print_exc()
        is_running = False
        stop()
    finally:
        is_running = False
        auto_forward_mode = False  # 자동 전진 모드 해제


def publish_position(client, car_id, node_id, node_name):
    """
    RC카 위치 이벤트 발행
    Topic: rccar/{carId}/position
    Payload: {"nodeId":1,"nodeName":"입구","timestamp":"2025-12-14 10:30:00"}
    """
    if client is None:
        return
        
    topic = f"rccar/{car_id}/position"
    # node_id가 None이면 JSON에서는 null로 직렬화되어 DB에 NULL로 저장되도록 함
    payload = {
        "nodeId": node_id if node_id is not None else None,
        "nodeName": node_name,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    json_payload = json.dumps(payload, ensure_ascii=False)
    client.publish(topic, json_payload)
    print(f"\n📤 [위치 발행] {topic} | {json_payload}", flush=True)


# ==========================================
# 메인 실행
# ==========================================
if __name__ == "__main__":
    print("=" * 60)
    print("🚗 RC카 서비스 요청 핸들러 시작")
    print("   키보드 제어 + 라인트레이싱 노드 감지")
    print("=" * 60)

    # MQTT 클라이언트 생성/연결 (설정/구독은 mqtt_gateway가 담당)
    client = mqtt_gateway.create_client(MQTT_CONFIG, on_message)

    try:
        mqtt_gateway.connect_and_loop_forever(client, MQTT_CONFIG)

    except KeyboardInterrupt:
        print("\n⏹️  사용자 중단")
        is_running = False
        try:
            stop()
        except:
            pass
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
    finally:
        try:
            client.disconnect()
        except:
            pass
        is_running = False
        try:
            stop()
        except:
            pass
        try:
            if GPIO is not None:
                GPIO.cleanup()
        except:
            pass
        print("👋 종료 완료")
