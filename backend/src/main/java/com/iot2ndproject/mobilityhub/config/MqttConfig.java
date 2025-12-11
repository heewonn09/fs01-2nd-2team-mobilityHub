package com.iot2ndproject.mobilityhub.config;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;

@Configuration
public class MqttConfig {

    @Value("${spring.mqtt.url}")
    private String brokerUrl;

//    @Value("${spring.mqtt.username}")
//    private String username;
//
//    @Value("${spring.mqtt.password}")
//    private String password;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();

        options.setServerURIs(new String[]{brokerUrl});

        // 아이디/비밀번호 설정
//        if (username != null && !username.isBlank()) {
//            options.setUserName(username);
//            options.setPassword(password.toCharArray());
//        }

        // 연결 옵션 (타임아웃, 세션 유지 등 필요하면 여기에 추가)
        options.setAutomaticReconnect(true); // 자동 재접속
        options.setCleanSession(true);

        factory.setConnectionOptions(options);
        return factory;
    }
}