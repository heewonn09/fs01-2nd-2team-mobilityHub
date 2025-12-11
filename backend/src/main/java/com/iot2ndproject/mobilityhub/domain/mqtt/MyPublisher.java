package com.iot2ndproject.mobilityhub.domain.mqtt;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.handler.annotation.Header;

// mqttOutboundChannel로 메시지를 던지는 입구
@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface MyPublisher {
    void sendToMqtt(String data);
    void sendToMqtt(String payload, @Header(MqttHeaders.TOPIC) String topic);
}