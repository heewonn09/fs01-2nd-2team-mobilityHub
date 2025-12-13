package com.iot2ndproject.mobilityhub.domain.user.service;

import com.iot2ndproject.mobilityhub.domain.user.dto.UserRequestDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserResponseDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserProfileDTO;

public interface UserService {
    void write(UserRequestDTO user);
    UserProfileDTO getProfile(String userId);
    void updateProfile(UserProfileDTO profileDTO);
}
