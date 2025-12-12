package com.iot2ndproject.mobilityhub.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


//스프링이 직접관리하는 객체가 아닌경우 스프링부트가 실행되면서 객체를 생성하고 관리할 수 있도록 설정파일에 등록
@Configuration
public class ChangeObjectConfig {
    @Bean
    public ModelMapper getModerMapper(){


        return new ModelMapper();
    }

}
