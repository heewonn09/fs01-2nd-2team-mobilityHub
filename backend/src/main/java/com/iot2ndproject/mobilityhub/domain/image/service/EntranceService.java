package com.iot2ndproject.mobilityhub.domain.image.service;

import com.iot2ndproject.mobilityhub.domain.image.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.image.dto.OcrEntryRequestDTO;

public interface EntranceService {

    // OCR 수신 (카메라 → 서버)
    EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto);

    // OCR 번호 수정
    void updateOcrNumber(Long imageId, String carNumber);

    // 입차 승인
    void approveEntrance(Long workId);

    // 최근 인식 번호판 조회
    EntranceResponseDTO getLatestEntrance();

}
