# -*- coding: utf-8 -*-
"""
Camera Trigger Subscriber
- topic: parking/web/entrance
- payload: comeIn  -> 정지 캡처 + 저장 + MQTT 전송
"""

import json
import os
import time
from datetime import datetime
import base64

import cv2
import paho.mqtt.client as mqtt
from picamera2 import Picamera2

# =========================
# MQTT 설정
# =========================
BROKER_IP = "192.168.137.1"
BROKER_PORT = 1883

SUB_TOPIC = "parking/web/entrance"
TRIGGER_PAYLOAD = "comeIn"

PUBLISH_CAPTURE_TOPIC = "parking/web/entrance/capture"
PUBLISH_META_TOPIC = "parking/web/entrance/image"

# =========================
# 저장 설정
# =========================
CAMERA_ID = "CAM_ENT"
SAVE_DIR = "./images"
os.makedirs(SAVE_DIR, exist_ok=True)


class CameraTriggerSubscriber:
    def __init__(self):
        # MQTT
        self.client = mqtt.Client("camera_trigger_sub")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        # Camera
        self.camera = Picamera2()
        self._init_camera()

        # 연속 캡처 방지
        self.last_capture_time = 0

    # =========================
    # Camera 초기화
    # =========================
    def _init_camera(self):
        config = self.camera.create_still_configuration(
            main={"format": "RGB888", "size": (1280, 720)}
        )
        self.camera.configure(config)
        self.camera.start()
        print("📷 카메라 초기화 완료 (1280x720)")

    # =========================
    # MQTT 연결
    # =========================
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("✅ MQTT 연결 성공")
            client.subscribe(SUB_TOPIC)
            print(f"📡 구독 토픽: {SUB_TOPIC}")
        else:
            print("❌ MQTT 연결 실패:", rc)

    # =========================
    # MQTT 수신
    # =========================
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode(errors="ignore").strip()

        print(f"📩 수신 topic={topic}, payload={payload}")

        if topic != SUB_TOPIC:
            return

        if payload != TRIGGER_PAYLOAD:
            print("⚠️ 트리거 payload 아님, 무시")
            return

        now = time.time()
        if now - self.last_capture_time < 1:
            print("⚠️ 연속 트리거 방지")
            return

        self.last_capture_time = now
        self.capture_and_process()

    # =========================
    # 캡처 + 저장 + 전송
    # =========================
    def capture_and_process(self):
        try:
            frame = self.camera.capture_array()

            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{CAMERA_ID}_{ts}.jpg"
            path = os.path.join(SAVE_DIR, filename)

            cv2.imwrite(path, frame)

            print("📸 캡처 완료")
            print("💾 저장:", path)

            # 1️⃣ 이미지 메타 전송
            self.publish_image_meta(path)

            # 2️⃣ 캡처 이미지(base64) 전송
            self.publish_capture_image(path)

        except Exception as e:
            print("❌ 캡처 실패:", e)

    # =========================
    # 이미지 메타 전송
    # =========================
    def publish_image_meta(self, image_path):
        payload = {
            "cameraId": CAMERA_ID,
            "imagePath": image_path,
            "ocrNumber": None,
            "regDate": datetime.now().isoformat()
        }

        self.client.publish(
            PUBLISH_META_TOPIC,
            json.dumps(payload, ensure_ascii=False)
        )
        print("📤 이미지 메타 전송:", payload)

    # =========================
    # 캡처 이미지(base64) 전송
    # =========================
    def publish_capture_image(self, image_path):
        with open(image_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode()

        self.client.publish(
            PUBLISH_CAPTURE_TOPIC,
            encoded
        )
        print("📤 캡처 이미지 MQTT 전송 완료")

    # =========================
    # 시작
    # =========================
    def start(self):
        print(f"🔌 MQTT 연결 시도: {BROKER_IP}:{BROKER_PORT}")
        self.client.connect(BROKER_IP, BROKER_PORT, 60)
        print("🟢 comeIn 트리거 대기중...\n")
        self.client.loop_forever()


if __name__ == "__main__":
    try:
        CameraTriggerSubscriber().start()
    except KeyboardInterrupt:
        print("\n🛑 종료")
