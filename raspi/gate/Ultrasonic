import RPi.GPIO as GPIO
import time

class UltrasonicSensor:
    def __init__(self, trig=23, echo=24):
        self.trig = trig
        self.echo = echo
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.trig, GPIO.OUT)
        GPIO.setup(self.echo, GPIO.IN)
        print(f" 초음파 센서 초기화 완료 (TRIG={self.trig}, ECHO={self.echo})")

    def measure_distance(self):
        """TRIG/ECHO를 이용해 거리(cm) 측정"""
        GPIO.output(self.trig, True)
        time.sleep(0.00001)
        GPIO.output(self.trig, False)

        start = time.time()
        end = time.time()

        while GPIO.input(self.echo) == 0:
            start = time.time()
        while GPIO.input(self.echo) == 1:
            end = time.time()

        duration = end - start
        distance = duration * 17150
        return round(distance, 2)

    def cleanup(self):
        GPIO.cleanup([self.trig, self.echo])
        print("🧹 초음파 센서 핀 정리 완료")
