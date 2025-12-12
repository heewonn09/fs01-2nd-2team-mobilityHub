package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorksearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkInfoService {

    private final WorksearchRepository worksearchRepository;

    // ✔ 금일 입차 조회
    public List<WorkInfoResponseDTO> getTodayEntryDTO() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return worksearchRepository
                .findByEntryTimeBetween(start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ 금일 출차 조회
    public List<WorkInfoResponseDTO> getTodayExitDTO() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return worksearchRepository
                .findByExitTimeBetween(start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ Entity → DTO 변환
    private WorkInfoResponseDTO convertToDTO(WorkInfoEntity e) {
        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();

        dto.setId(e.getId());
        dto.setCarState(e.getCarState());
        dto.setEntryTime(e.getEntryTime());
        dto.setExitTime(e.getExitTime());

        // 차량 정보
        if (e.getUserCar().getCar() != null) {
            dto.setCarNumber(e.getUserCar().getCar().getCarNumber());
        }

        // 이미지 정보
        if (e.getImage() != null) {
            dto.setImagePath(e.getImage().getImagePath());
            dto.setCameraId(e.getImage().getCameraId());
        }

        return dto;
    }
}
