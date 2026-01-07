# exit_worker.py
import time
from ultrasonic_sensor import UltrasonicSensor
from gate_servo import GateServo

class ExitWorker:
    def __init__(self):
        self.sensor = UltrasonicSensor(trig=23, echo=24)
        self.servo = GateServo(pin=19)
        self.detecting = True

    def watch_exit(self, on_detect):   
        print("🚗 출구 감지 시작")

        while self.detecting:
            if self.sensor.is_vehicle_detected():
                print("🚘 출차 차량 감지")
                self.servo.open()

                on_detect()        

                time.sleep(7)
                self.servo.close()
                time.sleep(3)

            time.sleep(0.3)
