import smbus
import time

class PCA9685:
    # 레지스터 주소
    MODE1 = 0x00
    MODE2 = 0x01
    PRESCALE = 0xFE
    LED0_ON_L = 0x06
    LED0_ON_H = 0x07
    LED0_OFF_L = 0x08
    LED0_OFF_H = 0x09
    
    # MODE1 비트 정의
    SLEEP = 0x10      # 비트 4: SLEEP (oscillator on/off)
    RESTART = 0x80    # 비트 7: RESTART
    
    # 서보 펄스 값 상수 (확대된 범위)
    MIN_PULSE = 100      # 최소 (더 낮은 값)
    CENTER_PULSE = 375   # 90도 (1.5ms)
    MAX_PULSE = 900      # 최대 (더 많이 올림!)
    
    def __init__(self, bus=1, address=0x40):
        self.bus = smbus.SMBus(bus)
        self.address = address
        self.init()
    
    def init(self):
        """PCA9685 초기화 - 올바른 순서"""
        try:
            # 단계 1: SLEEP 비트 설정 (oscillator 끔)
            print("⏸️  [1단계] Oscillator 끄기...")
            self.bus.write_byte_data(self.address, self.MODE1, self.SLEEP)
            time.sleep(0.01)
            
            # 단계 2: SLEEP 상태에서 PRESCALE 설정
            print("⚙️  [2단계] 주파수 설정 (50Hz)...")
            prescale_value = int(25000000 / (4096 * 50) - 1)
            print(f"   Prescale 값: {prescale_value}")
            self.bus.write_byte_data(self.address, self.PRESCALE, prescale_value)
            time.sleep(0.01)
            
            # 단계 3: SLEEP 비트 해제 (oscillator 켜기)
            print("🔋 [3단계] Oscillator 켜기...")
            self.bus.write_byte_data(self.address, self.MODE1, 0x00)
            time.sleep(0.5)  # oscillator 안정화 대기 (datasheet: 최대 500µs)
            
            # 단계 4: RESTART 비트 설정
            print("🔄 [4단계] RESTART 비트 설정...")
            mode1_value = self.bus.read_byte_data(self.address, self.MODE1)
            self.bus.write_byte_data(self.address, self.MODE1, mode1_value | self.RESTART)
            time.sleep(0.1)
            
            print("✅ PCA9685 초기화 완료!\n")
            
        except Exception as e:
            print(f"❌ 초기화 오류: {e}")
            raise
    
    def set_pwm(self, channel, pulse):
        """채널에 PWM 설정"""
        on_time = 0
        off_time = pulse
        
        on_l = self.LED0_ON_L + 4 * channel
        on_h = self.LED0_ON_H + 4 * channel
        off_l = self.LED0_OFF_L + 4 * channel
        off_h = self.LED0_OFF_H + 4 * channel
        
        self.bus.write_byte_data(self.address, on_l, on_time & 0xFF)
        self.bus.write_byte_data(self.address, on_h, (on_time >> 8) & 0xFF)
        self.bus.write_byte_data(self.address, off_l, off_time & 0xFF)
        self.bus.write_byte_data(self.address, off_h, (off_time >> 8) & 0xFF)
        
        print(f"   ➤ 채널 {channel}: PWM {pulse} 설정")
    
    def lift_up(self, channel=0, duration=5.0):
        """최소에서 최대로 점진적 이동 (5초 이상)"""
        print(f"\n🔄 채널 {channel}: 하강 → 상승 이동 ({duration}초)")
        
        # 초기 위치 설정
        self.set_pwm(channel, self.MIN_PULSE)
        time.sleep(1)
        
        # 미세한 단계로 천천히 올리기
        step = 2  # 더 작은 스텝 = 더 부드러운 움직임
        pulse_range = self.MAX_PULSE - self.MIN_PULSE
        num_steps = pulse_range / step
        speed = duration / num_steps
        
        print(f"   📊 스텝: {step}, 총 {num_steps:.0f}번 움직임, 각 간격: {speed:.4f}초")
        print(f"   📏 PWM 범위: {self.MIN_PULSE} ~ {self.MAX_PULSE}\n")
        
        for pulse in range(self.MIN_PULSE, self.MAX_PULSE + 1, step):
            self.set_pwm(channel, pulse)
            time.sleep(speed)
        
        print(f"✅ 최대 위치: PWM {self.MAX_PULSE}\n")
    
    def lift_down(self, channel=0, duration=5.0):
        """180도에서 0도로 점진적 이동 (5초 이상)"""
        print(f"\n🔄 채널 {channel}: 180도 → 0도 복귀 ({duration}초)")
        
        print(f"   ➤ 현재 위치: 180도")
        time.sleep(1)
        
        # 미세한 단계로 천천히 내리기
        step = 2  # 더 작은 스텝 = 더 부드러운 움직임
        pulse_range = self.MAX_PULSE - self.MIN_PULSE  # 450
        num_steps = pulse_range / step  # 225 스텝
        speed = duration / num_steps  # 5초 / 225 = 약 0.022초
        
        print(f"스텝: {step}, 총 {num_steps:.0f}번 움직임, 각 간격: {speed:.4f}초\n")
        
        for pulse in range(self.MAX_PULSE, self.MIN_PULSE - 1, -step):
            self.set_pwm(channel, pulse)
            time.sleep(speed)
        
        print(f"초기 위치: 0도 (PWM: {self.MIN_PULSE})\n")