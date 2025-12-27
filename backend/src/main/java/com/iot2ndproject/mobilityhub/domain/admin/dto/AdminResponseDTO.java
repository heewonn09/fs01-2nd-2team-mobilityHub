package com.iot2ndproject.mobilityhub.domain.admin.dto;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 관리자 정보 뽑아내기 위한 Response

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponseDTO {
    private String adminId;
    private String adminPass;
    private String adminName;
    private String email;
    private String phone;
    private String role;

    public AdminResponseDTO(AdminEntity entity) {
        this.adminId = entity.getAdminId();
        this.adminPass = entity.getAdminPass();
        this.adminName = entity.getAdminName();
        this.email = entity.getEmail();
        this.phone = entity.getPhone();
        this.role = entity.getRole();
    }
}
