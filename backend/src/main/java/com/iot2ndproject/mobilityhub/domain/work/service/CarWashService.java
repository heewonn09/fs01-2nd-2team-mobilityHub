package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dto.WashResponse;


import java.util.List;

public interface CarWashService {

    // 세차 목록 가져오기
    List<WashResponse> findAll();
    // workId를 조회해서 세차장에서 작업 중인 차량 조회
//    List<WashResponse> findByWokrId(int workId);
}
