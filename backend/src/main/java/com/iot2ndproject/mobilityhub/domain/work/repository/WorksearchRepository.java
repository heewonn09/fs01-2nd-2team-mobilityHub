package com.iot2ndproject.mobilityhub.domain.work.repository;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface WorksearchRepository extends JpaRepository<WorkInfoEntity, Long> {

    List<WorkInfoEntity> findByEntryTimeBetween(LocalDateTime start, LocalDateTime end);
    List<WorkInfoEntity> findByExitTimeBetween(LocalDateTime start, LocalDateTime end);

}
