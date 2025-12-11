package com.iot2ndproject.mobilityhub.domain.mqtt;

import lombok.RequiredArgsConstructor;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.stereotype.Service;
import org.springframework.messaging.Message;

@Service
@RequiredArgsConstructor
public class MqttService {
    private final MyPublisher publisher;
    int count=0;
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<String> message) {
        // 메시지 페이로드(내용)
        String payload = message.getPayload();
        // 헤더에서 토픽 정보 가져오기
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);

        System.out.println("Received Message: " + payload);
        System.out.println("Received Topic: " + topic);

        // 여기서 DB에 저장하거나 로직을 수행하면 됩니다.
        count++;
        System.out.println(count);
        if(count==10){
            System.out.println("조건만족");
            publisher.sendToMqtt("mymess","home/test");
        }
    }
//    private final MessageChannel mqttOutboundChannel;

//    public void publish(String topic, String payload) {
//        Message<String> message = MessageBuilder.withPayload(payload)
//                .setHeader(MqttHeaders.TOPIC, topic)
//                .build();
//        mqttOutboundChannel.send(message);
//    }
}