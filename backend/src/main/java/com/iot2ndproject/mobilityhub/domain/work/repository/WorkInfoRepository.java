package com.iot2ndproject.mobilityhub.domain.work.repository;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkInfoRepository extends JpaRepository<WorkInfoEntity, Long> {
    List<WorkInfoEntity> findByUserCar_User_UserIdOrderByRequestTimeDesc(String userId);
}
