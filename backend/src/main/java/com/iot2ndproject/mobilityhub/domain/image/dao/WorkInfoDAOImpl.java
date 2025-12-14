package com.iot2ndproject.mobilityhub.domain.image.dao;

import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WorkInfoDAOImpl implements WorkInfoDAO {

    private final WorkInfoRepository workInfoRepository;

    @Override
    public WorkInfoEntity save(WorkInfoEntity workInfo) {
        return workInfoRepository.save(workInfo);
    }

    @Override
    public WorkInfoEntity findLatest() {
        return (WorkInfoEntity) workInfoRepository
                .findTopByImageIsNotNullOrderByRequestTimeDesc()
                .orElseThrow(() -> new IllegalArgumentException("최근 입차 기록 없음"));
    }

    @Override
    public WorkInfoEntity findById(Long workId) {
        return workInfoRepository.findById(workId)
                .orElseThrow(() -> new IllegalArgumentException("입차 기록 없음"));
    }

    // 🔥 OCR / 최근 인식 번호판 전용
    @Override
    public EntranceEntryView findLatestWithImage() {
        return workInfoRepository
                .findTopByImageIsNotNullOrderByRequestTimeDesc()
                .orElse(null); // ❗ throw 금지 (프론트에서 처리)
    }
}
