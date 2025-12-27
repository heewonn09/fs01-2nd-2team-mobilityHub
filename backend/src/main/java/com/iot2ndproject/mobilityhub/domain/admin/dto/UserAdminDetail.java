package com.iot2ndproject.mobilityhub.domain.admin.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class UserAdminDetail extends User {
    private final AdminResponseDTO adminResponseDTO;

    public UserAdminDetail(AdminResponseDTO adminLoginResponse, Collection<? extends GrantedAuthority> authorities) {
        super(adminLoginResponse.getAdminId(), adminLoginResponse.getAdminPass(), authorities);
        this.adminResponseDTO = adminLoginResponse;
    }

    public AdminResponseDTO getAdminResponseDTO() {
        return adminResponseDTO;
    }
}
