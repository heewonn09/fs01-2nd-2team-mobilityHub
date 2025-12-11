package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dto.WashResponse;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

import java.util.List;

public interface CarWashService {

    // workId를 조회해서 세차장에서 작업 중인 차량 조회
    List<WashResponse> findByWokrId(int workId);
}
