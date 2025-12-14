package com.iot2ndproject.mobilityhub.domain.image.dao;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

public interface WorkInfoDAO {
    WorkInfoEntity save(WorkInfoEntity workInfo);
    WorkInfoEntity findLatest();
    WorkInfoEntity findById(Long workId);
    WorkInfoEntity findLatestWithImage();
}
