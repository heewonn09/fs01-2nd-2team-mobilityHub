package com.iot2ndproject.mobilityhub.global.config;

import com.iot2ndproject.mobilityhub.domain.user.jwt.CustomJWTFilter;
import com.iot2ndproject.mobilityhub.domain.user.jwt.TokenProvider;
import com.iot2ndproject.mobilityhub.global.security.MyAuthenticationProvider;
import com.iot2ndproject.mobilityhub.global.security.UserSecurityDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
//@EnableWebSecurity(debug = true)
@EnableWebSecurity
@RequiredArgsConstructor
public class JWTSecurityConfig {
    private final UserSecurityDetailService detailService;
    private final TokenProvider tokenProvider;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        return new MyAuthenticationProvider(passwordEncoder(),detailService);
    }
    @Bean
    public SecurityFilterChain chain(HttpSecurity http) throws Exception{
        http.csrf(csrf->csrf.disable())
                //사용자정의필터를 어느 위치에서 실행할건지 등록하는 작업 필요
                //특정 필터가 실행되기 전에 실행되도록 작업
                .addFilterBefore(new CustomJWTFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers("/user/create","/user/login",  "/carwash/select", "/api/entry/ocr", "/admin/login").permitAll()
//                        .requestMatchers("/customer/create").hasAnyRole("ADMIN")
//                        .requestMatchers("product/**").hasAnyRole("USER","ADMIN")
                        //.anyRequest().authenticated())
                .anyRequest().permitAll())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .cors(cors->cors.configurationSource(corsConfigurationSource()));
        return http.build();

    }
//
//    @Bean
//    public UserDetailsService userDetailsService(){
//        UserDetails user =  User.withDefaultPasswordEncoder().password("1234").username("user").roles("USER").build();
//        UserDetails admin = User.withDefaultPasswordEncoder().username("admin").password("1234").roles("ADMIN").build();
//        return new InMemoryUserDetailsManager(user,admin);
//    }






    //CROS오류 처리되도록 추가
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration corsConfigurationSource = new CorsConfiguration();

        //cors정책에 대한 세팅 값을 추가
        corsConfigurationSource.addAllowedOrigin("http://localhost:5173");
        corsConfigurationSource.addAllowedOrigin("http://localhost:3000");
        //허용할 http의 method
        corsConfigurationSource.addAllowedMethod("*"); //GET, POST, PUT, DELETE ... 등 모두 허용
        //허용할 헤더 설정 - 모든 헤더 허용
        corsConfigurationSource.addAllowedHeader("*");
        //자격증명 허용(쿠키, JWT 등 모두 허용) - 프론트에서
        corsConfigurationSource.setAllowCredentials(true);
        corsConfigurationSource.addExposedHeader("Authorization");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",corsConfigurationSource);
    return source;
    }
    //스프링에서 인식하는 정적 리소스가 저장된 폴더를 스프링 시큐리티에서 제외하기

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        return web -> {
            web.ignoring()
                    .requestMatchers(
                            PathRequest.toStaticResources().atCommonLocations()
                    );
        };
    }
}
