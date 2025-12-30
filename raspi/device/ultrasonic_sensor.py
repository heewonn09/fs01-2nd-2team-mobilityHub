# ultrasonic_sensor.py
import RPi.GPIO as GPIO
import time

class UltrasonicSensor:
    def __init__(self, trig=23, echo=24, threshold=5):
        self.trig = trig
        self.echo = echo
        self.threshold = threshold  

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.trig, GPIO.OUT)
        GPIO.setup(self.echo, GPIO.IN)

        GPIO.output(self.trig, False)
        time.sleep(1)

    def get_distance(self):
        GPIO.output(self.trig, True)
        time.sleep(0.00001)
        GPIO.output(self.trig, False)

        timeout = time.time() + 0.06

        while GPIO.input(self.echo) == 0:
            if time.time() > timeout:
                return None

        start = time.time()

        while GPIO.input(self.echo) == 1:
            if time.time() > timeout:
                return None

        end = time.time()

        duration = end - start
        distance = duration * 17150
        return round(distance, 2)

    def is_vehicle_detected(self):
        dist = self.get_distance()

        if dist is None or dist > 100:
            print("[ULTRA] 미감지")
            return False

        print(f"[ULTRA] 거리: {dist}cm")
        return dist <= self.threshold
