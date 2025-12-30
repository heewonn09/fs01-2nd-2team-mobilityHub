# exit_worker.py
import time
import json
import paho.mqtt.publish as publisher
from ultrasonic_sensor import UltrasonicSensor
from gate_servo import GateServo

BROKER_IP = "192.168.14.83"

class ExitWorker:
    def __init__(self):
        self.sensor = UltrasonicSensor(trig=23, echo=24)
        self.servo = GateServo(pin=19)
        self.detecting = True

    def watch_exit(self):
        print("🚗 출구 감지 시작")

        while self.detecting:
            if self.sensor.is_vehicle_detected():
                print("🚘 출차 차량 감지")
                self.servo.open()

                publisher.single(
                    "parking/web/exit/detected",
                    json.dumps({"gate": "EXIT", "time": time.time()}),
                    hostname=BROKER_IP
                )

                time.sleep(5)
                self.servo.close()
                time.sleep(3)

            time.sleep(0.3)
