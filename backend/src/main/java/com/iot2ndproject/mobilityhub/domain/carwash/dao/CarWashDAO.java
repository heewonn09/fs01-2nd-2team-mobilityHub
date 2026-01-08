package com.iot2ndproject.mobilityhub.domain.carwash.dao;

import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.util.List;

public interface CarWashDAO {

    // 세차 작업 목록 조회
    List<WorkInfoEntity> carWashing();
}
