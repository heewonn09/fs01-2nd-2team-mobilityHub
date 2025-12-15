# -*- coding: utf-8 -*-
"""MQTT gateway helpers for RC car service handler.

This module owns:
- broker/topic configuration
- connect + subscribe lifecycle
- client creation wiring callbacks

Business logic (parsing payloads, driving motors) stays in service_handler.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Iterable, Optional

import paho.mqtt.client as mqtt


@dataclass(frozen=True)
class MqttConfig:
    broker_address: str
    port: int
    subscribe_topics: tuple[str, ...]
    client_id: str
    keepalive: int = 60


DEFAULT_CONFIG = MqttConfig(
    broker_address="192.168.35.183",
    port=1883,
    subscribe_topics=(
        "rccar/+/command",
        "rccar/+/service",
        "rccar/+/call",
    ),
    client_id="rc_car_service_handler",
)


def default_on_disconnect(client, userdata, rc):
    print("🔌 MQTT 브로커 연결 종료")


def _make_on_connect(config: MqttConfig, extra_on_connect=None):
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print(f"✅ MQTT 브로커 연결 성공: {config.broker_address}")
            for topic in config.subscribe_topics:
                client.subscribe(topic)
            print("📡 구독 토픽:")
            for topic in config.subscribe_topics:
                print(f"   - {topic}")
            if extra_on_connect is not None:
                extra_on_connect(client, userdata, flags, rc)
        else:
            print(f"❌ 연결 실패, return code: {rc}")

    return on_connect


def create_client(
    config: MqttConfig,
    on_message: Callable,
    *,
    on_disconnect: Optional[Callable] = None,
    extra_on_connect: Optional[Callable] = None,
) -> mqtt.Client:
    client = mqtt.Client(config.client_id)
    client.on_connect = _make_on_connect(config, extra_on_connect=extra_on_connect)
    client.on_disconnect = on_disconnect or default_on_disconnect
    client.on_message = on_message
    return client


def connect_and_loop_forever(client: mqtt.Client, config: MqttConfig) -> None:
    print(f"🔌 브로커 연결 시도: {config.broker_address}:{config.port}")
    print("   (연결이 안 되면 네트워크 설정과 브로커 주소를 확인하세요)")

    client.connect(config.broker_address, config.port, keepalive=config.keepalive)
    print("📡 메시지 수신 대기 중... (Ctrl+C로 종료)\n")
    client.loop_forever()
