package com.iot2ndproject.mobilityhub.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;

import java.util.UUID;

@Configuration
public class MqttSubConfig {
    @Value("${spring.mqtt.client-id}")
    private String clientId;
    @Value("${spring.mqtt.topic.sensor}")
    private String sensorTopic;
    @Value("${spring.mqtt.topic.position}")
    private String positionTopic;
    
    // 1. 수신 채널 생성
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }
    
    // --- [진단 1] 클래스가 로딩되었는지 확인하는 확실한 방법 ---
    @PostConstruct
    public void init() {
        System.out.println("======================================================");
        System.out.println(">>> MqttSubConfig 로딩됨!");
        System.out.println(">>> 구독 토픽 1: " + sensorTopic);
        System.out.println(">>> 구독 토픽 2: " + positionTopic);
        System.out.println("======================================================");
    }
    
    // 2. MQTT 어댑터 (브로커 -> 채널로 데이터 밀어넣기) - 센서 토픽
    @Bean
    public MessageProducer inboundAdapter(MqttPahoClientFactory mqttClientFactory) {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId + "_sub_sensor_"
                        + UUID.randomUUID().toString(),
                        mqttClientFactory, sensorTopic);
        System.out.println("======================================================");
        System.out.println("센서 토픽 어댑터 생성: " + sensorTopic);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel()); // mqttInputChannel로 전송
        return adapter;
    }
    
    // 3. RC카 위치 신호 구독 어댑터
    @Bean
    public MessageProducer positionInboundAdapter(MqttPahoClientFactory mqttClientFactory) {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(clientId + "_sub_position_"
                        + UUID.randomUUID().toString(),
                        mqttClientFactory, positionTopic);
        System.out.println("======================================================");
        System.out.println("위치 토픽 어댑터 생성: " + positionTopic);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel()); // 같은 채널로 전송
        return adapter;
    }
    // --- [진단 2] 채널에 데이터가 들어오는지 훔쳐보는 코드 (디버깅용) ---
    // MqttService가 없어도 이 코드가 있으면 메시지 도착 시 로그가 찍힙니다.
//    @Bean
//    public IntegrationFlow logFlow() {
//        return f -> f.channel("mqttInputChannel") // 이 채널을 지켜보다가
//                .handle(m -> {
//                    System.out.println(">>> [디버깅] 채널 통과 중: " + m.getPayload());
//                });
//    }
}