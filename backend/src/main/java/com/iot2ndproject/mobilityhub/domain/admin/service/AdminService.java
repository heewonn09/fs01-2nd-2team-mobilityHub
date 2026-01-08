package com.iot2ndproject.mobilityhub.domain.admin.service;

import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminPassChangeRequest;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminResponseDTO;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminUpdateRequest;

import java.util.List;

public interface AdminService {

    // 관리자 전체조회
    List<AdminResponseDTO> adminList();

    // 관리자 별 정보수정페이지
    AdminResponseDTO getAdminInfo(String adminId);

    // 정보수정
    AdminResponseDTO updateInfo(String adminId, AdminUpdateRequest request);

    // 비밀번호 변경
    void changePassword(String adminId, AdminPassChangeRequest request);

}
