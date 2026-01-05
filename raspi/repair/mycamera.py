import threading
import time
import io
import base64
from picamera2 import Picamera2

class MyCamera:
    frame = None 
    thread = None 
    def getStreaming(self):
        if MyCamera.thread is None:
            MyCamera.thread = threading.Thread(target=self.streaming)
            MyCamera.thread.start() 
            
            while MyCamera.frame is None:
                time.sleep(0.01) 
                
        return MyCamera.frame
    
    @classmethod 
    def streaming(cls):

        device = Picamera2() 
        config = device.create_video_configuration(main={"format":"RGB888", "size":(320, 240)})
        
        device.configure(config)
        
        device.start()
        
        # 상하좌우를 반전시킬 수 있도록 작업 - start 이후설정
        device.hflip = True 
        device.vflip = True 
        
        time.sleep(1)
        
        # 메모리에 임시공간을 만들고 프레임을 저장하고 작업 초당 20장씩 쓰고 읽고를 SD카드에서 작업하면 느리다.
        stream = io.BytesIO()
        # 2. 지속적으로 카메라로 촬영된 사진을 변환하기 
        #    카메라 촬영하는 장면을 한 프레임씩 캡쳐해서 jpeg로 압축하고 메모리공간의 임시저장소에 저장
        #    1초에 20프레임을 만들어낼 수 있도록 작업 
        try:
            while True:    
                # 사진을 찍어서 임시공간에 저장
                device.capture_file(stream, format="jpeg")
                # 메모리에 만들어 놓은 임시공간이 스트림에서 데이터 읽어서 frame에 저장
                # 스트림의 끝에 포커스가 맞춰져 있기 때문에 그 위치 부터 데이터를 읽으면 저장된
                # 데이터가 없으므로 포커스를 맨 앞으로 이동시켜서 데이터를 읽어야 한다.
                stream.seek(0)
                raw_data = stream.read()
                # 이미지를 변환 - 바이너리데이터를 네트워크로 전송하기 위해서 Base64인코딩한다. 
                base64_bytes = base64.b64encode(raw_data)
                cls.frame = base64_bytes.decode("utf-8")
                
                # 스트림초기화(다음촬영을 위해서- 스트림의 모든 데이터 지우기)
                stream.seek(0)
                stream.truncate()
                time.sleep(0.05)
        except Exception as e:
            #print(f"카메라 스트리밍오류..{e}")
            device.stop()