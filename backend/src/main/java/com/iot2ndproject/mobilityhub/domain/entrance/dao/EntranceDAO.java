package com.iot2ndproject.mobilityhub.domain.entrance.dao;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EntranceDAO {

    // Image
    ImageEntity save(ImageEntity image);
    ImageEntity findById(Long imageId);
    ImageEntity findLatest();

    // WorkInfo
    Optional<WorkInfoEntity> findLatestEntranceWork(); // workId=1
    List<WorkInfoEntity> findEntryBetween(LocalDateTime start, LocalDateTime end);
    List<WorkInfoEntity> findExitBetween(LocalDateTime start, LocalDateTime end);

    // List
    List<WorkInfoEntity> findAll();
    List<WorkInfoEntity> findAllToday(); // 파생메서드가 애매해서 DAO에서 필터링
}
