package com.iot2ndproject.mobilityhub.domain.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserListDTO {
    private String userId;
    private String userName;
    private LocalDateTime createDate; // 가입일
    private String tel;
}
