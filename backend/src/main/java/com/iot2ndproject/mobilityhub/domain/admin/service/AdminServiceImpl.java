package com.iot2ndproject.mobilityhub.domain.admin.service;

import com.iot2ndproject.mobilityhub.domain.admin.dao.AdminDAO;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminPassChangeRequest;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminResponseDTO;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminUpdateRequest;
import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminDAO adminDAO;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    // 관리자 전체조회
    @Override
    public List<AdminResponseDTO> adminList() {
        List<AdminEntity> adminList = adminDAO.findAll();
        return adminList.stream()
                .map(admin -> modelMapper.map(admin, AdminResponseDTO.class))
                .collect(Collectors.toList());
    }

    // 관리자 별 정보수정페이지
    @Override
    public AdminResponseDTO getAdminInfo(String adminId) {
        AdminEntity entity = adminDAO.findByAdminId(adminId);

        return modelMapper.map(entity, AdminResponseDTO.class);
    }

    // 정보수정
    @Override
    public AdminResponseDTO updateInfo(String adminId, AdminUpdateRequest request) {
        AdminEntity entity = adminDAO.findByAdminId(adminId);

        entity.setAdminName(request.getAdminName());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());

        return modelMapper.map(adminDAO.updateAdminInfo(entity), AdminResponseDTO.class);
    }

    // 비밀번호 변경
    @Override
    public void changePassword(String adminId, AdminPassChangeRequest request) {
        AdminEntity entity = adminDAO.findByAdminId(adminId);

        if(!passwordEncoder.matches(request.getCurrentPassword(), entity.getAdminPass())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        adminDAO.updatePassword(adminId, passwordEncoder.encode(request.getNewPassword()));
    }
}
