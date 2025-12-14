package com.iot2ndproject.mobilityhub.domain.work.repository;

import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkInfoRepository extends JpaRepository<WorkInfoEntity, Long> {
    List<EntranceEntryView> findByEntryTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );
    List<WorkInfoEntity> findByUserCar_User_UserIdOrderByRequestTimeDesc(String userId);
    List<WorkInfoEntity> findByUserCar_User_UserIdAndWorkIsNotNullOrderByRequestTimeDesc(String userId);


    Optional<WorkInfoEntity> findTopByImageIsNotNullOrderByRequestTimeDesc();
    
    // carNumber로 최신 작업 정보 조회
    Optional<WorkInfoEntity> findTopByUserCar_Car_CarNumberOrderByRequestTimeDesc(String carNumber);
}
