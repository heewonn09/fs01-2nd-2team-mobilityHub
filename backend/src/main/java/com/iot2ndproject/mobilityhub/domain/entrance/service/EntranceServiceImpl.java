package com.iot2ndproject.mobilityhub.domain.entrance.service;

import com.iot2ndproject.mobilityhub.domain.car.dao.CarDAO;
import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.dao.EntranceDAO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.*;
import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.dao.WorkInfoDAO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntranceServiceImpl implements EntranceService {

    private final EntranceDAO entranceDAO;
    // ===============================================
    // 최근 입차 조회
    // ===============================================
    @Override
    public EntranceResponseDTO getLatestEntrance() {

        WorkInfoEntity w = entranceDAO.findLatestEntranceWork().orElse(null);
        if (w == null) return null;

        EntranceResponseDTO dto = new EntranceResponseDTO();
        dto.setWorkId(w.getId());

        if (w.getUserCar() != null && w.getUserCar().getCar() != null) {
            dto.setCarNumber(w.getUserCar().getCar().getCarNumber());
        }

        if (w.getImage() != null) {
            dto.setImageId((long) w.getImage().getImageId());
            dto.setImagePath(w.getImage().getImagePath());
            dto.setCameraId(w.getImage().getCameraId());
        }

        dto.setTime(w.getRequestTime());
        dto.setMatch(true);

        return dto;
    }
    // 금일 입차
    @Override
    public List<WorkInfoResponseDTO> getTodayEntryDTO() {

        LocalDate today = LocalDate.now();

        return entranceDAO
                .findEntryBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay())
                .stream()
                .map(this::convertToDTOFromWorkInfo)
                .collect(Collectors.toList());
    }

    // 금일 출차
    @Override
    public List<WorkInfoResponseDTO> getTodayExitDTO() {

        LocalDate today = LocalDate.now();

        return entranceDAO
                .findExitBetween(today.atStartOfDay(), today.plusDays(1).atStartOfDay())
                .stream()
                .map(this::convertToDTOFromWorkInfo)
                .collect(Collectors.toList());
    }

    // 전체 작업 목록
    @Override
    public List<WorkInfoResponseDTO> findAll() {

        return entranceDAO.findAll()
                .stream()
                .map(w -> {
                    WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
                    if (w.getWork() != null) {
                        dto.setWorkId(w.getWork().getWorkId());
                        dto.setWorkType(w.getWork().getWorkType());
                    }
                    dto.setEntryTime(w.getRequestTime());
                    dto.setExitTime(w.getExitTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 오늘 작업 목록 전체
    @Override
    public List<WorkInfoResponseDTO> findAllToday() {

        return entranceDAO.findAllToday()
                .stream()
                .map(w -> {
                    WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
                    if (w.getWork() != null) {
                        dto.setWorkId(w.getWork().getWorkId());
                        dto.setWorkType(w.getWork().getWorkType());
                    }
                    dto.setEntryTime(w.getEntryTime() != null ? w.getEntryTime() : w.getRequestTime());
                    dto.setExitTime(w.getExitTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    private WorkInfoResponseDTO convertToDTOFromWorkInfo(WorkInfoEntity w) {

        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
        dto.setId(String.valueOf(w.getId()));

        dto.setEntryTime(w.getEntryTime() != null ? w.getEntryTime() : w.getRequestTime());
        dto.setExitTime(w.getExitTime());

        if (w.getUserCar() != null && w.getUserCar().getCar() != null) {
            dto.setCarNumber(w.getUserCar().getCar().getCarNumber());
        }

        if (w.getImage() != null) {
            dto.setImagePath(w.getImage().getImagePath());
            dto.setCameraId(w.getImage().getCameraId());
        }

        return dto;
    }
}
