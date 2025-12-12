package com.iot2ndproject.mobilityhub.domain.work.repository;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.data.repository.CrudRepository;

public interface WorkInfoRepository extends CrudRepository<WorkInfoEntity, String> {
}
