package com.iot2ndproject.mobilityhub.global.security;

import com.iot2ndproject.mobilityhub.domain.admin.dto.UserAdminDetail;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;


@RequiredArgsConstructor
public class MyAuthenticationProvider implements AuthenticationProvider {
    private final PasswordEncoder passwordEncoder;
    private final UserSecurityDetailService detailService;
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String id = authentication.getName();
        String pass = authentication.getCredentials().toString();
        UserDetails userDetails = detailService.loadUserByUsername(id);
        System.out.println("userDetails = " + userDetails.getUsername());
        boolean state = false;
        UsernamePasswordAuthenticationToken authenticationToken = null;
        if(userDetails!=null){
            state = passwordEncoder.matches(pass, userDetails.getPassword());
            if(state){
                if (userDetails.getUsername().endsWith("admin")) {
                    authenticationToken = new UsernamePasswordAuthenticationToken(((UserAdminDetail) userDetails).getAdminResponseDTO(), null, userDetails.getAuthorities());
                }else{
                    authenticationToken = new UsernamePasswordAuthenticationToken(((UserUserDetail) userDetails).getResponseDTO(),null, userDetails.getAuthorities());
                }
            }
        }


        return authenticationToken;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
