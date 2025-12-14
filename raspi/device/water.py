import RPi.GPIO as gpio
import time 
from rgb_led import RGBLed

class PumpController:
    # 제어를 위한 초기화
    def __init__(self, pwm_pin=17, dir_pin = 27, freq=1000):
        self.pwm_pin = pwm_pin
        self.dir_pin = dir_pin
        
        gpio.setmode(gpio.BCM)
        gpio.setup(self.pwm_pin, gpio.OUT)
        gpio.setup(self.dir_pin, gpio.OUT)
        
        # 방향 고정
        gpio.output(self.dir_pin, gpio.LOW)
        
        # PWM 설정
        self.pwm = gpio.PWM(self.pwm_pin, freq)
        self.pwm.start(0)
        
        # RGB LED 연결
        self.rgb = RGBLed(r_pin=20, g_pin=21, b_pin=16)
        
    # 펌프 동작 함수 (출력강도, on시간, 반복 횟수, off 시간)
    def run(self, duty=60, run_time=3, repeat=3, off_time=1):
        for i in range(repeat):
            step = i + 1
            
            # RGB Led 색상 표시
            if step == 1:
                self.rgb.blue()
            elif step == 2:
                self.rgb.green()
            elif step == 3:
                self.rgb.red()
            
            print(f"[PUMP] {step}/{repeat} 동작 - {duty}%")
            
            self.pwm.ChangeDutyCycle(duty)
            time.sleep(run_time)
            
            self.pwm.ChangeDutyCycle(0)
            
            if i < repeat - 1:
                time.sleep(off_time)
        
        self.rgb.off()
                
    def stop(self):
        self.pwm.ChangeDutyCycle(0)
        self.rgb.off()
        
    def cleanup(self):
        self.pwm.stop()
        gpio.cleanup()