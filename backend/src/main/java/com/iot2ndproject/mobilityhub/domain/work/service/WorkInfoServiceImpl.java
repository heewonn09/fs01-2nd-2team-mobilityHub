package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.CarRepository;
import com.iot2ndproject.mobilityhub.domain.work.dao.WorkListDAO;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoTotalListResponse;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorksearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private WorkListDAO dao;

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

    @Override
    public List<WorkInfoTotalListResponse> workInfoTotalList() {

        List<WorkInfoTotalListResponse> list = dao.findAll().stream()
                .filter(entity -> entity.getRequestTime().toLocalDate().isEqual(LocalDate.now()))
                .map(WorkInfoTotalListResponse::new)
                .collect(Collectors.toList());


        return list;
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


    // 모든 작업 목록 가져오기
    @Override
    public List<WorkInfoResponseDTO> findAll() {
        System.out.println("작업목록 service");

        return dao.findAll()
                .stream()
                .map(entity -> {
                    WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
                    dto.setWorkId(entity.getWork().getWorkId());
                    dto.setWorkType(entity.getWork().getWorkType());
                    dto.setEntryTime(entity.getRequestTime());
                    dto.setExitTime(entity.getExitTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 오늘 작업목록 전체 불러오기
    @Override
    public List<WorkInfoResponseDTO> findAllToday() {
        System.out.println("오늘작업목록 조회 service");

        LocalDate today = LocalDate.now();

        return dao.findAllToday()
                .stream()
                .filter(w -> {
                    LocalDate entryDate = w.getRequestTime().toLocalDate();
                    return entryDate.equals(today);
                })
                .map(w -> {
                    WorkInfoResponseDTO dto = new WorkInfoResponseDTO();
                    dto.setWorkId(w.getWork().getWorkId());
                    dto.setWorkType(w.getWork().getWorkType());
                    dto.setEntryTime(w.getEntryTime());
                    dto.setExitTime(w.getExitTime());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 🔥 Projection → DTO 변환
    private WorkInfoResponseDTO convertToDTO(EntranceEntryView v) {

        WorkInfoResponseDTO dto = new WorkInfoResponseDTO();

        dto.setId(Long.toString(v.getId()));
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

