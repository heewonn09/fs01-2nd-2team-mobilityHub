package com.iot2ndproject.mobilityhub.domain.work.dao;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestDAO {
    WorkInfoEntity save(WorkInfoEntity entity);
    List<WorkInfoEntity> saveAll(Iterable<WorkInfoEntity> entities);
    Optional<WorkInfoEntity> findById(Long id);
    List<WorkInfoEntity> findByUserIdOrderByRequestTimeDesc(String userId);
}
