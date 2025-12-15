import paho.mqtt.client as client 
from threading import Thread 

from mycamera import MyCamera
import paho.mqtt.publish as publisher

from water import PumpController
from threading import Thread
import time
from repair_lift import PCA9685

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
        
        # 세차장 - 물펌프
        
        # 리프트
        self.pca = PCA9685()
        
        
    # broker 연결 후 실행될 콜백 - rc가 0이면 성공접속, 1이면 실패
    def on_connect(self, client,userdata, flags,rc):
        print("connect...:::"+str(rc))
        if rc==0:    # 연결성공 -> 구독신청
            client.subscribe("parking/#")    # 구독신청 
        else:
            print("연결실패")
            
            
    # 메시지가 수신되면 자동으로 호출되는 메소드
    def on_message(self, client, userdata, message):
        myval = message.payload.decode("utf-8")

        # 세차장과 정비소 카메라 작동
        if message.topic == "parking/web/carwash/cam" or message.topic == "parking/web/repair/cam":
            if myval == "start":
                print(message.topic, myval)
                if not self.is_streaming:
                    self.is_streaming = True
                    Thread(target=self.send_camera_frame, daemon=True).start()
                    
            elif myval == "stop":
                print(message.topic, myval)
                self.is_streaming = False
            
        elif message.topic == "parking/web/carwash":
            
            if myval == "comeIn":
                print("세차장에 진입해 펌프 동작 시작합니다")
                
                Thread(
                    target=self.carwash_job).start()
                
        elif message.topic == "parking/web/repair/lift":
            if myval == "up":
                print(message.topic, myval)
                self.pca.lift_up(channel=0, speed=0.05)
            elif myval == "down":
                print(message.topic, myval)
                self.pca.lift_down(channel=0, speed=0.05)
                
                
            if message.topic == "parking/web/entrance/cam":
                if myval == "start":
                    if not self.is_streaming:
                        self.is_streaming = True
                        Thread(target=self.send_entrance_camera, daemon=True).start()
                elif myval == "stop":
                    self.is_streaming = False

            
            
            
    # 프레임을 지속적으로 publish하는 코드를 스레드로 실행
    def send_camera_frame(self):
        while self.is_streaming:
            try:
                frame = self.camera.getStreaming()
                ##publisher.single("parking/web/carwash/cam", frame, hostname="192.168.14.38")
                #publisher.single("parking/web/carwash/cam", frame, hostname="192.168.137.1")
                publisher.single("parking/web/repair/cam", frame, hostname="192.168.14.39") # 작업하는 사람의 브로커 주소 넣기
                
                
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
        
    #입구 전용 스트리밍 publish 함수    
    def send_entrance_camera(self):
            while self.is_streaming:
                try:
                    frame = self.camera.getStreaming()
                    if frame is None:
                        continue

                    publisher.single(
                        "parking/web/entrance/cam",
                        frame,
                        hostname="192.168.137.1"
                    )
                    time.sleep(0.05)  # 약 20fps
                except Exception as e:
                    print("📡 entrance cam error:", e)
                    self.is_streaming = False
                    break

            
    # mqtt서버연결을 하는 메소드 - 사용자정의
    def mymqtt_connect(self):
        try:
            print("브로커 연결 시작하기")
            #self.client.connect("192.168.45.38", 1883, 60)
            self.client.connect("192.168.137.1", 1883, 60)
            

            mymqtt_obj = Thread(target=self.client.loop_forever)
            mymqtt_obj.start()
        except KeyboardInterrupt:
            pass 
        finally:
            print("종료")