package com.iot2ndproject.mobilityhub.domain.work.dao;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

import java.util.Date;
import java.util.List;

public interface CarWashDAO {

//    // work_id(작업장소)로 세차장 조회
//    List<WorkInfoEntity> findByWorkId(int workId);
    
    // 세차 작업 목록 조회
    List<WorkInfoEntity> carWashing();
}
