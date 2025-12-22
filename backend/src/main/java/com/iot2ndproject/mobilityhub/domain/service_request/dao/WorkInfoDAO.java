package com.iot2ndproject.mobilityhub.domain.service_request.dao;

import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.util.List;
import java.util.Optional;

public interface WorkInfoDAO {

    /**
     * 이미지 기준 중복 매칭 방지
     */
    boolean existsByImageId(Long imageId);

    /**
     * WorkInfo 저장
     */
    WorkInfoEntity save(WorkInfoEntity workInfo);

    /**
     * workInfoId로 단건 조회
     */
    Optional<WorkInfoEntity> findById(Long workInfoId);

    /**
     * 전체 작업 목록
     */
    List<WorkInfoEntity> findAll();
}
