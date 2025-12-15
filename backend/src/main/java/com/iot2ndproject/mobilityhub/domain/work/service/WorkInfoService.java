package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoTotalListResponse;

import java.util.List;

public interface WorkInfoService {

    // ✔ 금일 입차
    List<WorkInfoResponseDTO> getTodayEntryDTO();

    // ✔ 금일 출차
    List<WorkInfoResponseDTO> getTodayExitDTO();

    // 종합 리스트
    List<WorkInfoTotalListResponse> workInfoTotalList();

    // ✔ 번호판 수정
    void updatePlateNumber(Long workInfoId, String newCarNumber);

    // 작업 전체 목록 보기
    List<WorkInfoResponseDTO> findAll();

    // 오늘 작업 목록만 가져오기
    List<WorkInfoResponseDTO> findAllToday();
}