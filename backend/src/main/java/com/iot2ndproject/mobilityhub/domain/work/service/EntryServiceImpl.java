package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.image.repository.ImageRepository;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.repository.ParkingRepository;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.UserCarRepository;
import com.iot2ndproject.mobilityhub.domain.work.dto.OcrEntryRequest;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EntryServiceImpl implements EntryService {

    private final ImageRepository imageRepository;
    private final UserCarRepository carRepository;
    private final ParkingRepository parkingRepository;
    private final WorkInfoRepository workInfoRepository;

    @Override
    public WorkInfoEntity handleEntry(OcrEntryRequest req) {

        // 1) 이미지 저장
        ImageEntity image = new ImageEntity(
                req.getCameraId(),
                req.getImagePath()
        );
        imageRepository.save(image);

        // 2) 차량 조회
        UserCarEntity car = carRepository.findByCarCarNumber(req.getCarNumber());

        // 3) 카메라ID = 주차 구역 ID
        ParkingEntity parking = parkingRepository
                .findById(req.getCameraId())
                .orElse(null);

        // 4) 입차 기록 생성
        WorkInfoEntity work = new WorkInfoEntity();
        work.setUserCar(car);
        work.setImage(image);
        work.setSectorId(parking);
        work.setCarState("WAIT");
        work.setEntryTime(LocalDateTime.now());
        work.setRequestTime(LocalDateTime.now());

        // 5) 저장
        workInfoRepository.save(work);

        return work;
    }
}
