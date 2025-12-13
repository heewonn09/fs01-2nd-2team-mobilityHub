package com.iot2ndproject.mobilityhub.domain.work.repository;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkRepository extends JpaRepository<WorkEntity, Integer> {
    Optional<WorkEntity> findByWorkType(String workType);
}
