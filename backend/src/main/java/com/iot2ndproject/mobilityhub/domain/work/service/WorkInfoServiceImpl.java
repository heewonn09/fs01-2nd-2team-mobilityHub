package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.CarRepository;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorksearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

        return worksearchRepository
                .findByEntryTimeBetween(
                        today.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✔ 금일 출차
    @Override
    public List<WorkInfoResponseDTO> getTodayExitDTO() {
        LocalDate today = LocalDate.now();

        return worksearchRepository
                .findByExitTimeBetween(
                        today.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                )
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

    // 🔥 Projection → DTO 변환
    private WorkInfoResponseDTO convertToDTO(EntranceEntryView v) {

        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();

        dto.setId(v.getId());
        dto.setEntryTime(v.getEntryTime());
        dto.setExitTime(v.getExitTime());
        dto.setCarNumber(v.getUserCar_Car_CarNumber());
        dto.setImagePath(v.getImage_ImagePath());

        dto.setCameraId(
                v.getImage_CameraId() != null
                        ? v.getImage_CameraId().toString()
                        : null
        );

        return dto;
    }
    }

