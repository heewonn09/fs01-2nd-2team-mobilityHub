package com.iot2ndproject.mobilityhub.domain.entry.dao;

import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EntryDAOImpl implements EntryDAO {

    private final WorkInfoRepository workInfoRepository;

    @Override
    public Optional<WorkInfoEntity> findWorkInfoById(Long workId) {
        return workInfoRepository.findById(workId);
    }
    @Override
    public List<WorkInfoEntity> findTodayEntry(LocalDateTime start, LocalDateTime end) {
        return workInfoRepository.findByEntryTimeBetween(start, end);
    }
    @Override
    public WorkInfoEntity save(WorkInfoEntity workInfo) {
        return workInfoRepository.save(workInfo);
    }
}
