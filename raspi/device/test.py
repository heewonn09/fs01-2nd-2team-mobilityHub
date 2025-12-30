# import mymqtt 
# import time 

# if __name__ == "__main__":
#     try:
#         mqtt = mymqtt.MqttWorker()
#         mqtt.mymqtt_connect()
        
#         for i in range(10):
#             print(i)
#             time.sleep(0.5)
            
#     except KeyboardInterrupt:
#         pass 
    
#     finally:
#         print("종료")

# test.py
# --------------------------------------------------
# 모든 디바이스 통합 실행 파일
# - 세차장 (mymqtt.py)
# - 출입구 (camera_trigger_subscriber.py)
# --------------------------------------------------

from mymqtt import MqttWorker
from camera_trigger_subscriber import EntranceWorker
import threading
import time


def main():
    try:
        # =========================
        # 세차장 MQTT Worker
        # =========================
        print("🚿 세차장 디바이스 시작")
        carwash_worker = MqttWorker()
        carwash_worker.mymqtt_connect()

        # =========================
        # 출입구 Entrance Worker
        # =========================
        print("🚪 출입구 디바이스 시작")
        entrance_worker = EntranceWorker()

        entrance_thread = threading.Thread(
            target=entrance_worker.start,
            daemon=True
        )
        entrance_thread.start()

        # =========================
        # 메인 스레드 유지
        # =========================
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n🛑 test.py 종료")

    finally:
        print("🔻 시스템 종료")


if __name__ == "__main__":
    main()
