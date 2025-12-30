import paho.mqtt.client as client
from threading import Thread
import paho.mqtt.publish as publisher

from mycamera import MyCamera
from gate_servo import GateServo  
import time
import os
import json
import base64
from datetime import datetime

class EntranceWorker:

    def __init__(self):
        self.client = client.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        self.camera = MyCamera()
        self.servo = GateServo(pin=18)  

        self.is_streaming = False
        self.last_capture = 0

        self.BROKER_IP = "192.168.14.83"
        self.SAVE_DIR = "images"
        os.makedirs(self.SAVE_DIR, exist_ok=True)

    # =========================
    def on_connect(self, client, userdata, flags, rc):
        print("[ENT] connect:", rc)
        if rc == 0:
            client.subscribe("parking/web/entrance/#")

    # =========================
    def on_message(self, client, userdata, message):
        payload = message.payload.decode()

        # 스트리밍 제어
        if message.topic == "parking/web/entrance/cam":
            if payload == "start" and not self.is_streaming:
                self.is_streaming = True
                Thread(target=self.send_camera_frame, daemon=True).start()

            elif payload == "stop":
                self.is_streaming = False

        # 차량 진입
        elif message.topic == "parking/web/entrance" and payload == "comeIn":
            print("[ENT] 차량 진입 감지")
            self.capture_image()

        # 🔓 승인 → 게이트 열기
        elif message.topic == "parking/web/entrance/approve" and payload == "open":
            print("출입구 OPEN")
            Thread(target=self.open_and_close_gate, daemon=True).start()

    # =========================
    def send_camera_frame(self):
        while self.is_streaming:
            frame = self.camera.getStreaming()
            if frame:
                publisher.single(
                    "parking/web/entrance/cam",
                    frame,
                    hostname=self.BROKER_IP
                )
            time.sleep(0.05)

    # =========================
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

        # 이미지 전송
        publisher.single(
            "parking/web/entrance/capture",
            frame,
            hostname=self.BROKER_IP
        )

        # 메타 전송
        meta = {
            "cameraId": "CAM_ENT",
            "imagePath": path,
            "ocrNumber": None
        }

        publisher.single(
            "parking/web/entrance/image",
            json.dumps(meta),
            hostname=self.BROKER_IP
        )

        print("[ENT] 캡처 완료:", path)

    # =========================
    def open_and_close_gate(self):
        self.servo.open()
        time.sleep(7)
        self.servo.close()

    # =========================
    def start(self):
        self.client.connect(self.BROKER_IP, 1883, 60)
        Thread(target=self.client.loop_forever, daemon=True).start()
