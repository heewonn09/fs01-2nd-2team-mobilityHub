import paho.mqtt.client as client 
from threading import Thread 
from joystick_servo_controller import JoystickServoController
from mycamera import MyCamera
import paho.mqtt.publish as publisher
import json

from threading import Thread

class MqttWorker:
    # 생성자에서 mqtt통신할 수 있는 객체생성, 필요한 다양한 객체생성, 콜백함수등록
    def __init__(self):
        self.client = client.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        
        # self.dht11.start()   # 스레드 실행
        self.camera = MyCamera() 
        # 스트리밍의 상태를 제어하기 위해서 변수 
        self.is_streaming = False 
        
        self.prev_angle = None
        
        # 정비소 리프트 제어
        self.lift = JoystickServoController()
        self.lift.set_angle_callback(self.publish_servo_angle)
        
            
    # 프레임을 지속적으로 publish하는 코드를 스레드로 실행
    def send_camera_frame(self):
        while self.is_streaming:
            try:
                frame = self.camera.getStreaming()
                publisher.single("parking/web/repair/cam/frame", frame, hostname="192.168.14.69")# 작업하는 사람 브로커 주소 넣기
                
            except Exception as e:
                #print("영상 전송 중 에러: ", e)
                self.is_streaming = False 
                break
            
            
    def publish_servo_angle(self, angle):
        if angle == self.prev_angle:
            return 
        
        topic = "parking/web/repair/lift/angle"
        payload = json.dumps({
            "angle": angle
        })
        
        self.client.publish(topic, payload)
        
        self.prev_angle = angle
        
        
    # broker 연결 후 실행될 콜백 - rc가 0이면 성공접속, 1이면 실패
    def on_connect(self, client, userdata, flags,rc):
        print("connect...:::"+str(rc))
        if rc==0:    # 연결성공 -> 구독신청
            client.subscribe("parking/web/repair/#")    # 구독신청 
            Thread(target=self.lift.run, daemon=True).start()

        else:
            print("연결실패")
            
            
    # 메시지가 수신되면 자동으로 호출되는 메소드
    def on_message(self, client, userdata, message):
        myval = message.payload.decode("utf-8")

        # 세차장과 정비소 카메라 작동
        if message.topic == "parking/web/repair/cam/control":
            if myval == "start":
                print(message.topic, myval)
                if not self.is_streaming:
                    self.is_streaming = True
                    Thread(target=self.send_camera_frame, daemon=True).start()
                    
            elif myval == "stop":
                print(message.topic, myval)
                self.is_streaming = False
            
            
    # mqtt서버연결을 하는 메소드 - 사용자정의
    def mymqtt_connect(self):
        try:
            print("브로커 연결 시작하기")
            self.client.connect("192.168.14.69", 1883, 60)

            mymqtt_obj = Thread(target=self.client.loop_forever)
            mymqtt_obj.start()
        except KeyboardInterrupt:
            pass 
        finally:
            print("종료")