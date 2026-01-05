import mymqtt
import time

if __name__ == "__main__":
    try:
        mqtt = mymqtt.MqttWorker()
        mqtt.mymqtt_connect()
        
        for i in range(10):
            print(i)
            time.sleep(0.5)
            
    except KeyboardInterrupt:
        pass 
    
    finally:
        print("종료")