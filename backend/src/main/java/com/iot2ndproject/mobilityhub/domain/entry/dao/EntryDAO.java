package com.iot2ndproject.mobilityhub.domain.entry.dao;

import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EntryDAO {

    Optional<WorkInfoEntity> findWorkInfoById(Long workId);

    List<WorkInfoEntity> findTodayEntry(LocalDateTime start, LocalDateTime end);

    WorkInfoEntity save(WorkInfoEntity workInfo);
}
