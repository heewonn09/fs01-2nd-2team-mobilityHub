
import RPi.GPIO as gpio 


class RGBLed:
    def __init__(self, r_pin, g_pin, b_pin):
        self.r = r_pin
        self.g = g_pin 
        self.b = b_pin 
        
        gpio.setup(self.r, gpio.OUT)
        gpio.setup(self.g, gpio.OUT)
        gpio.setup(self.b, gpio.OUT)
        
        self.off()
        
    ## 색상 설정
    def set_color(self, r, g, b):
        gpio.output(self.r, gpio.HIGH if r else gpio.LOW)
        gpio.output(self.g, gpio.HIGH if g else gpio.LOW)
        gpio.output(self.b, gpio.HIGH if b else gpio.LOW)
        
    def red(self):
        self.set_color(1, 0, 0)
        
    def green(self):
        self.set_color(0, 1, 0)
        
    def blue(self):
        self.set_color(0, 0, 1)
        
    def off(self):
        self.set_color(0, 0, 0)
        
    
## https://blog.naver.com/emperonics/221841256106