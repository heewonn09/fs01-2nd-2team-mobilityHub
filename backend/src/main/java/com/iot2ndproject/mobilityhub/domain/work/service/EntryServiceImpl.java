package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.image.repository.ImageRepository;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.repository.ParkingRepository;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.UserCarRepository;
import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.dto.OcrEntryRequest;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EntryServiceImpl implements EntryService {

    private final ImageRepository imageRepository;
    private final UserCarRepository userCarRepository;
    private final ParkingRepository parkingRepository;
    private final WorkInfoRepository workInfoRepository;

    /**
     * ✅ 실제 입차 생성
     */
    @Override
    public WorkInfoEntity handleEntry(OcrEntryRequest req) {

        // 1️⃣ 이미지 조회
        ImageEntity image = imageRepository.findById(req.getImageId())
                .orElseThrow(() -> new IllegalArgumentException("이미지 없음"));

        // 2️⃣ 차량 조회
        UserCarEntity userCar =
                userCarRepository.findByCarCarNumber(req.getCarNumber());

        // 3️⃣ 주차 구역
        ParkingEntity parking =
                parkingRepository.findById(req.getCameraId()).orElse(null);

        // 4️⃣ 입차 기록 생성 (🔥 여기서만 WorkInfo 생성)
        WorkInfoEntity work = new WorkInfoEntity();
        work.setUserCar(userCar);
        work.setImage(image);
        work.setSectorId(parking);

        work.setEntryTime(LocalDateTime.now());
        work.setExitTime(null); // 중요
        work.setRequestTime(LocalDateTime.now());

        workInfoRepository.save(work);

        return work;
    }

    /**
     * 📊 금일 입차 조회
     */
    @Override
    public List<EntranceEntryView> getTodayEntry() {

        LocalDate today = LocalDate.now();

        return workInfoRepository.findByEntryTimeBetween(
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );
    }

    @Override
    public void approveEntrance(Long workId) {

        WorkInfoEntity work = workInfoRepository.findById(workId)
                .orElseThrow(() -> new IllegalArgumentException("입차 정보 없음"));

        // 👉 지금은 승인 시점에 할 게 이것뿐
        // (나중에 차단기 열기, 상태 변경 등 추가 가능)

        workInfoRepository.save(work);
    }
}
