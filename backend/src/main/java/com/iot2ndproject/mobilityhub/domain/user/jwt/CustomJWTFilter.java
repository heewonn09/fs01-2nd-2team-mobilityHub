package com.iot2ndproject.mobilityhub.domain.user.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

//실제필터에서 인증을 확인하도록 구
public class CustomJWTFilter extends GenericFilterBean {
    private final TokenProvider tokenProvider;

    public CustomJWTFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        //클라이언트가 요청하면 토큰을 꺼내서 유효성 체크를 하고 스프링시큐리티 내부에서 인식할 수 있도록
        //SpringSecurityContextHolder에 토큰정보를 저장 - 리액트에서 전달한 request객체에 토큰이 포함되어 있다.
        HttpServletRequest request1 = (HttpServletRequest) request;
        String jwtToken =getToken(request1);
        System.out.println("*********************커스텀필터===============");
        System.out.println(jwtToken);
        System.out.println("*******=*=***=**************=**********=*=*=*=**");
        //유효성 체크
        if(StringUtils.hasText(jwtToken) && tokenProvider.validatorToken(jwtToken)){
            //유효성 체크가 완료되면 토큰에서 인증정보를 꺼내기
            Authentication authentication = tokenProvider.getAuthentication(jwtToken);
            //토큰에서 인증정보를 꺼내서 SecurityContextHolder의 Context에 저장 - 이렇게 저장해야 스프링 시큐리티의 인증흐름을 탈 수 있고 인증된 사용자임을 확인할 수 있다.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }else {
            System.out.println("인증되지 않은 사용자로 토큰이 없습니다.");
        }
        //FilterChain등록된 다른 필터가 실행되거나 실행될 필터가 없으면 서블릿이 실행
        chain.doFilter(request,response);
    }

    //클라이언트의 요청정보에서 토큰을 꺼내서 리턴하는 메서드
    public String getToken(HttpServletRequest request){
        System.out.println("request: " + request.getHeader("Authorization"));
        String bearerToken = request.getHeader("Authorization");
        System.out.println("=============================");
        System.out.println("bearerToken: " +  bearerToken);
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7);

        }
        //토큰이 없거나 형식이 올바르지 않으면
        return null;
    }
}
