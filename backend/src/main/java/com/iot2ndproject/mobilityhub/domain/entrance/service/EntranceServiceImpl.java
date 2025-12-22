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
    private final CarDAO carDAO;
    private final WorkInfoDAO workInfoDAO;

    // ===============================================
    // OCR 수신
    // ===============================================
    @Override
    public EntranceResponseDTO receiveOcr(OcrEntryRequestDTO dto) {

        ImageEntity image = new ImageEntity();
        image.setCameraId(dto.getCameraId());
        image.setImagePath(dto.getImagePath());
        image.setOcrNumber(dto.getOcrNumber());

        entranceDAO.save(image);

        // 자동 매칭
        autoMatch(image);

        EntranceResponseDTO response = new EntranceResponseDTO();
        response.setImageId((long) image.getImageId());
        response.setImagePath(image.getImagePath());
        response.setCameraId(image.getCameraId());
        response.setOcrNumber(image.getOcrNumber());
        response.setCorrectedOcrNumber(image.getCorrectedOcrNumber());
        response.setTime(image.getRegDate());
        response.setMatch(false);

        return response;
    }

    // ===============================================
    // OCR 번호 수정 (관리자)
    // ===============================================
    @Override
    public void updateOcrNumber(Long imageId, String carNumber) {

        ImageEntity image = entranceDAO.findById(imageId);
        image.setCorrectedOcrNumber(carNumber);

        entranceDAO.save(image);

        // OCR 수정 후 재매칭
        autoMatch(image);
    }

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

    // 최신 이미지
    @Override
    public Object getLatestEntranceImage() {
        return entranceDAO.findLatest();
    }

    // ===============================================
    // OCR 자동 매칭 핵심 로직
    // ===============================================
    private void autoMatch(ImageEntity image) {

        String plate =
                (image.getCorrectedOcrNumber() != null)
                        ? image.getCorrectedOcrNumber()
                        : image.getOcrNumber();

        if (plate == null) return;

        UserCarEntity userCar = carDAO.findUserCarByCarNumber(plate).orElse(null);
        if (userCar == null) return;

        // 중복 매칭 방지
        if (workInfoDAO.existsByImageId((long) image.getImageId())) return;

        WorkInfoEntity workInfo = new WorkInfoEntity();
        workInfo.setUserCar(userCar);
        workInfo.setImage(image);
        workInfo.setRequestTime(LocalDateTime.now());

        WorkEntity entryWork = new WorkEntity();
        entryWork.setWorkId(1); // 입차
        workInfo.setWork(entryWork);

        workInfoDAO.save(workInfo);
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

    @Override
    public List<WorkInfoTotalListResponse> workInfoTotalList() {
        return List.of();
    }

    // 번호판 수정
    @Override
    public void updatePlateNumber(Long workInfoId, String newCarNumber) {

        WorkInfoEntity workInfo = workInfoDAO.findById(workInfoId)
                .orElseThrow(() -> new IllegalArgumentException("입차 기록이 없습니다."));

        UserCarEntity userCar = workInfo.getUserCar();
        CarEntity car = (userCar != null) ? userCar.getCar() : null;
        if (car == null) throw new IllegalArgumentException("차량 정보가 없습니다.");

        car.setCarNumber(newCarNumber);
        carDAO.save(car);
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
