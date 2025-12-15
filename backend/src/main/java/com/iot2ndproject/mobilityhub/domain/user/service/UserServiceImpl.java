package com.iot2ndproject.mobilityhub.domain.user.service;

import com.iot2ndproject.mobilityhub.domain.user.dao.UserDAO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserListDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserProfileDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserRequestDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserResponseDTO;
import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final ModelMapper modelMapper;
    private final UserDAO userDAO;
    private final PasswordEncoder encoder;
    @Override
    public void write(UserRequestDTO user) {
        user.setPassword(encoder.encode(user.getPassword()));
        UserEntity entity = modelMapper.map(user, UserEntity.class);
        System.out.println(entity);
        userDAO.create(entity);
    }

    @Override
    public UserProfileDTO getProfile(String userId) {
        UserEntity user = userDAO.findById(userId);
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setUserName(user.getUserName());
        dto.setTel(user.getTel());
        return dto;
    }

    @Override
    public void updateProfile(UserProfileDTO profileDTO) {
        UserEntity user = userDAO.findById(profileDTO.getUserId());
        user.setUserName(profileDTO.getUserName());
        user.setTel(profileDTO.getTel());
        userDAO.save(user);
    }

    // 유저 전체 목록 불러오기
    @Override
    public List<UserListDTO> getUserList() {
        return userDAO.findAll()
                .stream()
                .map(e -> {
                    UserListDTO dto = new UserListDTO();
                    dto.setUserId(e.getUserId());
                    dto.setCreateDate(e.getCreateDate());
                    dto.setUserName(e.getUserName());
                    dto.setTel(e.getTel());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
