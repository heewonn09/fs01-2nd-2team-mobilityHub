package com.iot2ndproject.mobilityhub.domain.entrance.service;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.*;

import java.util.List;

public interface EntranceService {

    EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto);

    void updateOcrNumber(Long imageId, String carNumber);

    EntranceResponseDTO getLatestEntrance();

    // 최신 이미지
    Object getLatestEntranceImage();

    // 오늘 입차/출차
    List<WorkInfoResponseDTO> getTodayEntryDTO();
    List<WorkInfoResponseDTO> getTodayExitDTO();

    // 작업 목록
    List<WorkInfoResponseDTO> findAll();
    List<WorkInfoResponseDTO> findAllToday();

    List<WorkInfoTotalListResponse> workInfoTotalList();

    // 번호판 수정
    void updatePlateNumber(Long workInfoId, String newCarNumber);
}
