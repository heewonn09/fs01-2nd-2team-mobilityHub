package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;

import java.util.List;

public interface WorkInfoService {

    // ✔ 금일 입차
    List<WorkInfoResponseDTO> getTodayEntryDTO();

    // ✔ 금일 출차
    List<WorkInfoResponseDTO> getTodayExitDTO();

    // ✔ 번호판 수정
    void updatePlateNumber(Long workInfoId, String newCarNumber);
}
