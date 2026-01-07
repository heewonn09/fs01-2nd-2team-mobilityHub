import mymqtt
import time

if __name__ == "__main__":
    mqtt = mymqtt.MqttWorker()
    mqtt.mymqtt_connect()

    try:
        while True:
            time.sleep(1)   
    except KeyboardInterrupt:
        print("🛑 종료 요청")
