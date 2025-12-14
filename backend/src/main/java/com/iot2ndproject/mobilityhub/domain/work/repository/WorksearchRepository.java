package com.iot2ndproject.mobilityhub.domain.work.repository;

import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.LocalDateTime;
import java.util.List;

public interface WorksearchRepository
        extends JpaRepository<WorkInfoEntity, Long> {

    List<EntranceEntryView> findByEntryTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<EntranceEntryView> findByExitTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}