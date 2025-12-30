import json
import RPi.GPIO as GPIO
import paho.mqtt.client as mqtt

# Slot mapping: (node_id, LED_PIN)
SLOTS = [
    (5, 24),  # P01
    (7, 25),  # P02
    (9, 12),  # P03
]

# MQTT config
MQTT_BROKER = "192.168.14.56"
MQTT_PORT = 1883
MQTT_TOPIC = "rccar/+/position"
MQTT_CLIENT_ID = "parking_slot_led_multi"

# car_id -> node_id
CAR_POSITIONS = {}


def setup_gpio():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    for _, pin in SLOTS:
        GPIO.setup(pin, GPIO.OUT)
        set_led(pin, False)


def set_led(pin, on):
    level = GPIO.HIGH if on else GPIO.LOW
    GPIO.output(pin, level)


def parse_car_id(topic):
    parts = topic.split("/")
    if len(parts) >= 3 and parts[0] == "rccar" and parts[2] == "position":
        return parts[1]
    return None


def parse_node_id(payload_bytes):
    try:
        payload = json.loads(payload_bytes.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return None
    node_id = payload.get("nodeId")
    if isinstance(node_id, int):
        return node_id
    if isinstance(node_id, float):
        return int(node_id)
    if isinstance(node_id, str) and node_id.strip().isdigit():
        return int(node_id.strip())
    return None


def update_leds():
    node_ids = set(CAR_POSITIONS.values())
    for slot_node_id, pin in SLOTS:
        set_led(pin, slot_node_id in node_ids)


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        client.subscribe(MQTT_TOPIC)
    else:
        print("MQTT connect failed:", rc)


def on_message(client, userdata, msg):
    car_id = parse_car_id(msg.topic)
    if not car_id:
        return

    node_id = parse_node_id(msg.payload)
    if node_id is None:
        CAR_POSITIONS.pop(car_id, None)
    else:
        CAR_POSITIONS[car_id] = node_id

    update_leds()


def setup_mqtt():
    if mqtt is None:
        raise RuntimeError("paho-mqtt not installed.")
    client = mqtt.Client(MQTT_CLIENT_ID)
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    return client




if __name__ == "__main__":
    setup_gpio()
    client = setup_mqtt()
    try:
        client.loop_forever()
    except KeyboardInterrupt:
        pass
    finally:
        client.disconnect()
        for _, pin in SLOTS:
            set_led(pin, False)
        GPIO.cleanup()
