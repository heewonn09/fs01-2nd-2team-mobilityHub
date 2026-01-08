import paho.mqtt.client as client
from threading import Thread

from mycamera import MyCamera
from gate_servo import GateServo
import paho.mqtt.publish as publisher

from water import PumpController
import time
import os
import json
import base64
from datetime import datetime
from exit_worker import ExitWorker


class MqttWorker:
    # 생성자에서 mqtt통신할 수 있는 객체생성, 필요한 다양한 객체생성, 콜백함수등록
    def __init__(self):
        self.client = client.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        # ===== 공통 =====
        self.camera = MyCamera()
        self.is_streaming = False

        # ===== 입출구 =====
        self.servo = GateServo(pin=18)
        self.last_capture = 0
        self.SAVE_DIR = "images"
        os.makedirs(self.SAVE_DIR, exist_ok=True)

        # 출구 워커
        self.exit_worker = ExitWorker()

    # ==================================================
    # broker 연결 후 실행될 콜백
    # ==================================================
    def on_connect(self, client, userdata, flags, rc):
        print("connect...:::", rc)
        if rc == 0:
            client.subscribe("parking/web/entrance/#")
            client.subscribe("parking/web/exit/#")
        else:
            print("연결실패")

    # ==================================================
    # 메시지 수신 처리
    # ==================================================
    def on_message(self, client, userdata, message):
        payload = message.payload.decode()

        # ===============================
        #  입출구 영역
        # ===============================
        if message.topic == "parking/web/entrance/cam/control":
            if payload == "start" and not self.is_streaming:
                print(message.topic, payload)
                self.is_streaming = True
                Thread(target=self.send_camera_frame, daemon=True).start()

            elif payload == "stop":
                print(message.topic, payload)
                self.is_streaming = False

        elif message.topic == "parking/web/entrance" and payload == "comeIn":
            print("[ENT] 차량 진입 감지")
            self.capture_image()

        elif message.topic == "parking/web/entrance/approve" and payload == "open":
            print("[ENT] 출입구 OPEN")
            Thread(target=self.open_and_close_gate, daemon=True).start()

        
    # ==================================================
    # 카메라 프레임 전송 
    # ==================================================
    def send_camera_frame(self):
        while self.is_streaming:
            try:
                frame = self.camera.getStreaming()
                publisher.single(
                    "parking/web/entrance/cam/frame",
                    frame,
                    hostname="192.168.14.69"
                )
            except Exception:
                self.is_streaming = False
                break

    # ==================================================
    # 📷 캡처 처리 (기존 코드 유지)
    # ==================================================
    def capture_image(self):
        now = time.time()
        if now - self.last_capture < 1:
            return
        self.last_capture = now

        frame = self.camera.getStreaming()
        if not frame:
            return

        img_bytes = base64.b64decode(frame)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = f"{self.SAVE_DIR}/CAM_ENT_{ts}.jpg"

        with open(path, "wb") as f:
            f.write(img_bytes)

        publisher.single(
            "parking/web/entrance/capture",
            frame,
            hostname="192.168.14.69"
        )

        meta = {
            "cameraId": "CAM_ENT",
            "imagePath": path,
            "ocrNumber": None
        }

        publisher.single(
            "parking/web/entrance/image",
            json.dumps(meta),
            hostname="192.168.14.69"
        )

        print("[ENT] 캡처 완료:", path)

    # ==================================================
    #  게이트 제어
    # ==================================================
    def open_and_close_gate(self):
        self.servo.open()
        time.sleep(7)
        self.servo.close()

    # ==================================================
    #  출구 감지 콜백 
    # ==================================================
    def handle_exit_detected(self):
        print(" 출구 감지 → MQTT 전송")

        publisher.single(
            "parking/web/exit/detected",
            json.dumps({
                "gate": "EXIT",
                "time": time.time()
            }),
            hostname="192.168.14.69"
        )

    # ==================================================
    # MQTT 연결
    # ==================================================
    def mymqtt_connect(self):
        try:
            print("브로커 연결 시작하기")
            self.client.connect("192.168.14.69", 1883, 60)

            Thread(target=self.client.loop_forever, daemon=True).start()

            #  출구 감지 시작 (콜백 연결)
            Thread(
                target=self.exit_worker.watch_exit,
                args=(self.handle_exit_detected,),
                daemon=True
            ).start()

        except KeyboardInterrupt:
            pass
        finally:
            print("종료")
