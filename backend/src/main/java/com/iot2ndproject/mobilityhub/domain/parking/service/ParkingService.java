package com.iot2ndproject.mobilityhub.domain.parking.service;

import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.repository.ParkingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParkingService {

    private final ParkingRepository parkingRepository;

    /**
     * 빈 주차 공간 조회
     * @return 빈 주차 공간 목록 (state가 "empty"인 ParkingEntity)
     */
    public List<ParkingEntity> findAvailableSpaces() {
        return parkingRepository.findAll().stream()
                .filter(parking -> parking.getState() != null && 
                        parking.getState().equalsIgnoreCase("empty"))
                .toList();
    }

    /**
     * 빈 주차 공간이 있는지 확인
     * @return 빈 공간이 있으면 true, 없으면 false
     */
    public boolean hasAvailableSpace() {
        return !findAvailableSpaces().isEmpty();
    }

    /**
     * 주차 공간 할당
     * @param workInfoId 작업 정보 ID
     * @param sectorId 섹터 ID
     * @return 할당된 ParkingEntity
     * @throws IllegalArgumentException 섹터를 찾을 수 없거나 이미 사용 중인 경우
     */
    public ParkingEntity allocateSpace(Long workInfoId, String sectorId) {
        if (sectorId == null || sectorId.isBlank()) {
            throw new IllegalArgumentException("섹터 ID가 필요합니다.");
        }
        
        Optional<ParkingEntity> optionalParking = parkingRepository.findById(sectorId);
        
        if (optionalParking.isEmpty()) {
            throw new IllegalArgumentException("주차 공간을 찾을 수 없습니다: " + sectorId);
        }

        ParkingEntity parking = optionalParking.get();
        
        if (parking.getState() == null || !parking.getState().equalsIgnoreCase("empty")) {
            throw new IllegalArgumentException("해당 주차 공간은 이미 사용 중입니다: " + sectorId);
        }

        // 주차 공간 상태를 "occupied"로 변경
        parking.setState("occupied");
        parkingRepository.save(parking);

        return parking;
    }

    /**
     * 첫 번째 빈 주차 공간 자동 할당
     * @param workInfoId 작업 정보 ID
     * @return 할당된 ParkingEntity
     * @throws IllegalStateException 빈 공간이 없는 경우
     */
    @Transactional
    public ParkingEntity allocateFirstAvailableSpace(Long workInfoId) {
        List<ParkingEntity> availableSpaces = findAvailableSpaces();
        
        if (availableSpaces.isEmpty()) {
            throw new IllegalStateException("사용 가능한 주차 공간이 없습니다.");
        }

        // 첫 번째 빈 공간 할당
        ParkingEntity firstAvailable = availableSpaces.get(0);
        return allocateSpace(workInfoId, firstAvailable.getSectorId());
    }

    /**
     * 주차 공간 해제
     * @param sectorId 섹터 ID
     */
    @Transactional
    public void releaseSpace(String sectorId) {
        if (sectorId == null || sectorId.isBlank()) {
            return;
        }
        
        Optional<ParkingEntity> optionalParking = parkingRepository.findById(sectorId);
        
        if (optionalParking.isPresent()) {
            ParkingEntity parking = optionalParking.get();
            parking.setState("empty");
            parkingRepository.save(parking);
        }
    }
}

