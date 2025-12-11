package com.iot2ndproject.mobilityhub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttPubConfig {

    @Value("${spring.mqtt.client-id}")
    private String clientId;

    @Value("${spring.mqtt.topic.command}")
    private String defaultTopic;

    // 1. 송신 채널 생성 (파이프)
    @Bean
    public MessageChannel mqttOutboundChannel() {
        return new DirectChannel();
    }

    // 2. 채널과 MQTT 핸들러 연결
    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound(MqttPahoClientFactory mqttClientFactory) {
        // 클라이언트 ID가 겹치지 않게 _pub을 붙임
        MqttPahoMessageHandler messageHandler =
                new MqttPahoMessageHandler(clientId + "_pub", mqttClientFactory);

        messageHandler.setAsync(true);
        messageHandler.setDefaultTopic(defaultTopic);
        return messageHandler;
    }
}