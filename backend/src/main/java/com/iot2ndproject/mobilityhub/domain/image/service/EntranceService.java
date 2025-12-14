package com.iot2ndproject.mobilityhub.domain.image.service;

import com.iot2ndproject.mobilityhub.domain.image.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.image.dto.OcrEntryRequestDTO;

public interface EntranceService {

    EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto);

    void updateOcrNumber(Long imageId, String carNumber);

    EntranceResponseDTO getLatestEntrance();
}
