package com.iot2ndproject.mobilityhub.domain.admin.dao;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;

import java.util.List;

public interface AdminDAO {

    // 전체 관리자 목록 조회
    List<AdminEntity> findAll();

    // 아이디로 관리자 조회
    AdminEntity findByAdminId(String adminId);

    // 관리자 정보수정
    AdminEntity updateAdminInfo(AdminEntity admin);

    // 관리자 비밀번호 수정
    void updatePassword(String adminId, String encodedPass);

}
