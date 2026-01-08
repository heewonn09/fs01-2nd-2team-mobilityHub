import paho.mqtt.client as client 
from threading import Thread 

from mycamera import MyCamera
import paho.mqtt.publish as publisher

from water import PumpController
from threading import Thread
import time

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
        
        self.pump = PumpController()
         
            
    # 프레임을 지속적으로 publish하는 코드를 스레드로 실행
    def send_camera_frame(self):
        while self.is_streaming:
            try:
                frame = self.camera.getStreaming()
                publisher.single("parking/web/carwash/cam/frame", frame, hostname="192.168.14.69")
                
                
            except Exception as e:
                #print("영상 전송 중 에러: ", e)
                self.is_streaming = False 
                break

    # 세차장 진입 시 대기 후 펌프 작동
    def carwash_job(self):
        print("세차장 진입 -> 3초 대기")
        time.sleep(3)
        
        print("펌프 동작 시작")
        self.pump.run()
        
        print("세차 완료!")
        self.client.publish("parking/web/carwash", "end")
        
        
        # broker 연결 후 실행될 콜백 - rc가 0이면 성공접속, 1이면 실패
    def on_connect(self, client,userdata, flags,rc):
        print("connect...:::"+str(rc))
        if rc==0:    # 연결성공 -> 구독신청
            client.subscribe("parking/web/carwash/#")    # 구독신청 
        else:
            print("연결실패")
            
            
    # 메시지가 수신되면 자동으로 호출되는 메소드
    def on_message(self, client, userdata, message):
        myval = message.payload.decode("utf-8")
        
        # 세차장 cctv 작동 토픽
        if message.topic == "parking/web/carwash/cam/control":
            if myval == "start":
                print(message.topic, myval)
                if not self.is_streaming:
                    self.is_streaming = True
                    Thread(target=self.send_camera_frame, daemon=True).start()
            elif myval == "stop":
                print(message.topic, myval)
                self.is_streaming = False
            
        # 세차장 워터펌프 작동 토픽
        elif message.topic == "parking/web/carwash":
            if myval == "comeIn":
                print("세차장에 진입해 펌프 동작 시작합니다")
                
                # 세차장 - 물펌프print("세차장 진입 -> 3초 대기")
                self.carwash_job()
            
    
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