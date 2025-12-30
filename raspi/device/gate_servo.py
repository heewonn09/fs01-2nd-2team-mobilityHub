import RPi.GPIO as GPIO
import time

class GateServo:
    def __init__(self, pin=18):
        self.pin = pin

        GPIO.setmode(GPIO.BCM)              # ✅ 항상 모드 설정
        GPIO.setup(self.pin, GPIO.OUT)      # ✅ 항상 OUTPUT 설정

        self.pwm = GPIO.PWM(self.pin, 50)  # 50Hz
        self.pwm.start(0)

        print("[SERVO] 초기화 완료")

    def open(self):
        print("[SERVO] OPEN")
        self.pwm.ChangeDutyCycle(7.5)  # 열림 각도
        time.sleep(0.7)
        self.pwm.ChangeDutyCycle(0)

    def close(self):
        print("[SERVO] CLOSE")
        self.pwm.ChangeDutyCycle(2.5)  # 닫힘 각도
        time.sleep(0.7)
        self.pwm.ChangeDutyCycle(0)

    def cleanup(self):
        self.pwm.stop()
        GPIO.cleanup()
