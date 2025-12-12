package com.iot2ndproject.mobilityhub.domain.repair.repository;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairRequestRepository extends JpaRepository<WorkInfoEntity, Long> {

}
