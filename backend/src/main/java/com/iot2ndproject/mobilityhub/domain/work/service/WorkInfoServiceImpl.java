package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.CarRepository;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorksearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkInfoServiceImpl implements WorkInfoService {

    private final WorksearchRepository worksearchRepository;
    private final WorkInfoRepository workInfoRepository;
    private final CarRepository carRepository;

    // ✔ 금일 입차
    @Override
    public List<WorkInfoResponseDTO> getTodayEntryDTO() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return worksearchRepository.findByEntryTimeBetween(start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ 금일 출차
    @Override
    public List<WorkInfoResponseDTO> getTodayExitDTO() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return worksearchRepository.findByExitTimeBetween(start, end)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ 번호판 수정
    @Override
    public void updatePlateNumber(Long workInfoId, String newCarNumber) {

        WorkInfoEntity workInfo = workInfoRepository.findById(workInfoId)
                .orElseThrow(() -> new IllegalArgumentException("입차 기록이 없습니다."));

        UserCarEntity userCar = workInfo.getUserCar();
        CarEntity car = userCar.getCar();

        car.setCarNumber(newCarNumber);
        carRepository.save(car);
    }

    // ✔ Entity → DTO 변환
    private WorkInfoResponseDTO convertToDTO(WorkInfoEntity e) {
        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();

        dto.setId(e.getId());
        dto.setCarState(e.getCarState());
        dto.setEntryTime(e.getEntryTime());
        dto.setExitTime(e.getExitTime());

        // 차량 정보 (NPE 방지)
        if (e.getUserCar() != null && e.getUserCar().getCar() != null) {
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
