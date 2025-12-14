package com.iot2ndproject.mobilityhub.domain.image.dao;

import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

public interface WorkInfoDAO {

    // 저장
    WorkInfoEntity save(WorkInfoEntity workInfo);

    // 엔티티 조회 (다른 로직용)
    WorkInfoEntity findLatest();
    WorkInfoEntity findById(Long workId);

    // 🔥 최근 OCR용 (Projection)
    EntranceEntryView findLatestWithImage();
}
