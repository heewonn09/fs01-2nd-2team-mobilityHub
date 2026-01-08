package com.iot2ndproject.mobilityhub.domain.entrance.service;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.*;

import java.util.List;

public interface EntranceService {


    EntranceResponseDTO getLatestEntrance();
    // 오늘 입차/출차
    List<WorkInfoResponseDTO> getTodayEntryDTO();
    List<WorkInfoResponseDTO> getTodayExitDTO();

    // 작업 목록
    List<WorkInfoResponseDTO> findAll();
    List<WorkInfoResponseDTO> findAllToday();

}
