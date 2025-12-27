package com.iot2ndproject.mobilityhub.domain.user.jwt;

import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminResponseDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserResponseDTO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

//토큰 작업을 수행하는 클래스
// 토큰 생성, 토큰 검증
@Component
public class TokenProvider {
    //secret과 tokenExTime값은 설정파일에서 읽어와야 하므로
    private final String secret;
    private final long tokenExTime;
    private Key key;
    //설정파일에서 해당 속성으로 정의된 속성의 값을 가져와서 매핑
    public TokenProvider(@Value("${jwt.secret}") String secret,
                         @Value("${jwt.token-valid-in-second}") long tokenExTime) {
        this.secret = secret;
        this.tokenExTime = tokenExTime;
    }
    //토큰에서 사용할 암호화 키를 초기화하는 작업
    //키생성
    //스프링이 TokenProvider객체를 생성하고 의존성주입이 끝난 직후에 init메서드를 호출하라는 의미
    //yaml파일에서 속성을 읽어서 세팅해야 하는데 생성자가 호출되는 시점에 yaml파일에서 secret키를 읽어오지 못한 상황이 발생할 수 있으므로
    //생성을 통해서 멤버변수 주입이 완전히 완료된 후 메서드가 자동으로 실행될 수 있도록 정의
    @PostConstruct
    public void init(){
        byte[] decodedata = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(decodedata);
    }
    //토큰 생성
    public String createToken(Authentication userInfo){
        //인증이 완료된 후 인증객체에 저장되어 있는 권한 정보를 꺼내서 하나의 문자열을 만들기
        String authorityList = userInfo.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        //토큰만료시간
        Date now = new Date();
        Date exDate = new Date(now.getTime()+this.tokenExTime);
        System.out.println("==============토큰생성==========");
        System.out.println(userInfo.getName());
        System.out.println("******************************");

        String userId = "";

        if (userInfo.getPrincipal() instanceof UserResponseDTO userDTO) {
            userId = userDTO.getUserId();

        } else if (userInfo.getPrincipal() instanceof AdminResponseDTO adminDTO) {
            userId = adminDTO.getAdminId();

        } else {
            userId = userInfo.getName();
        }
        String jwtToken = Jwts.builder()
                .setSubject(userId) //페이로드: id 정보
                .claim("role",authorityList) //페이로드: 기본으로 지정하는 값이 아닌 사용자 정의 정보
                .setExpiration(exDate) //페이로드 : 만료시간
                .signWith(key, SignatureAlgorithm.HS256) //서명 : 지정한 시크릿키로 암호화
                .compact();

        System.out.println(jwtToken);
        return jwtToken;
    }
    // 토큰 유효성 검증
    public boolean validatorToken(String token){
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                .setSigningKey(key)  //토큰을 생성할 때 사용한 키와 같은 키를 넣고 파싱
                .build()
                .parseClaimsJws(token);
            return true;
        }catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e){
            System.out.println("잘못된 형식으로 서명된 토큰입니다.");
        }catch (ExpiredJwtException e){
            System.out.println("만료된 토큰입니다.");
        }catch (UnsupportedJwtException e){
            System.out.println();
        }
        return false;
    }
    // 토큰에서 정보를 빼서 리턴하는 메서드 - 토큰에 담겨있는 정보로 Authentication 객체를 만들어서 리턴
    // 인증이 된 상태에서 request에 넘어온 토큰에 있는 인증정보를 스프링 시큐리티 내부에서 인식하게 하기 위해서
    // Authentication객체로 만들어서 SpringSecurityContextHolder에 저장해 놓아야 스프링 시큐리티 인증 시스템이 동작하며 인증된 사용자임을
    //알 수 있으므로 필요하다.
    public Authentication getAuthentication(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)  //토큰을 생성할 때 사용한 키와 같은 키를 넣고 파싱
                .build()
                .parseClaimsJws(token) //파싱할 토큰을 지정
                .getBody(); // 토큰에 저장된 데이터 꺼내기

        //권한정보 추출
        List<GrantedAuthority> authorityList =
                Arrays.stream(claims.get("role").toString().split(","))
                        //스트림으로 저장된 권한을 SpringSecurity가 권한으로 인식할 수 있도록 collection으로 만드는 작업
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
        //권한객체 이용해서 최종적으로 Authentication객체 만들기
        User principal = new User(claims.getSubject(),"",authorityList);
        return new UsernamePasswordAuthenticationToken(principal,token,authorityList);
    }

}
