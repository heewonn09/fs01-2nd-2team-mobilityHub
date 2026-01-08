package com.iot2ndproject.mobilityhub.domain.user.service;

import com.iot2ndproject.mobilityhub.domain.user.dto.UserListDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserProfileDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserRequestDTO;

import java.util.List;

public interface UserService {
    void write(UserRequestDTO user);
    UserProfileDTO getProfile(String userId);
    void updateProfile(UserProfileDTO profileDTO);

    // 주간 회원 통계 생성 (차트용)
    List<UserListDTO> getUserList();

    // 비밀번호 변경
    boolean changePassword(String userId, String currentPassword, String newPassword);
}
