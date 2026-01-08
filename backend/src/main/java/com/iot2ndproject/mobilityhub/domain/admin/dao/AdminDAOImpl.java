package com.iot2ndproject.mobilityhub.domain.admin.dao;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.admin.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AdminDAOImpl implements AdminDAO {
    private final AdminRepository adminRepository;

    // 관리자 전체정보 조회
    @Override
    public List<AdminEntity> findAll() {
        return adminRepository.findAll();
    }

    // 아이디로 관리자 조회
    @Override
    public AdminEntity findByAdminId(String adminId) {
        return adminRepository.findByAdminId(adminId);
    }

    // 관리자 정보수정
    @Override
    public AdminEntity updateAdminInfo(AdminEntity admin) {
        return adminRepository.save(admin);
    }

    // 비밀번호 수정
    @Override
    public void updatePassword(String adminId, String encodedPass) {
        AdminEntity entity = adminRepository.findByAdminId(adminId);
        entity.setAdminPass(encodedPass);
        adminRepository.save(entity);
    }
}
