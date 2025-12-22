package com.iot2ndproject.mobilityhub.domain.service_request.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestDAO {

    // 저장
    WorkInfoEntity save(WorkInfoEntity entity);
    List<WorkInfoEntity> saveAll(Iterable<WorkInfoEntity> entities);

    // 단건 조회
    Optional<WorkInfoEntity> findById(Long id);

    // 사용자 기준 서비스 요청 이력 (입/출차 제외)
    List<WorkInfoEntity> findByUserIdOrderByRequestTimeDesc(String userId);

    // 사용자 + 차량번호
    Optional<UserCarEntity> findByUser_UserIdAndCar_CarNumber(String userId, String carNumber);

    // 서비스(work) 조회
    Optional<WorkEntity> findWorkById(int workId);
}
