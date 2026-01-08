package com.iot2ndproject.mobilityhub.domain.user.dto;

import lombok.Data;

@Data
public class PasswordChangeDTO {
    private String userId;
    private String currentPassword;
    private String newPassword;
}
