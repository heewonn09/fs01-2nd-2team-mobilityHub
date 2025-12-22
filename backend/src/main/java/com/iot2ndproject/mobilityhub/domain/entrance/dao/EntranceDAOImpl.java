package com.iot2ndproject.mobilityhub.domain.entrance.dao;

import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.repository.ImageRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EntranceDAOImpl implements EntranceDAO {

    private final WorkInfoRepository workInfoRepository;
    private final ImageRepository imageRepository;

    @Override
    public List<WorkInfoEntity> findAll() {
        return workInfoRepository.findAll();
    }

    @Override
    public List<WorkInfoEntity> findAllToday() {
        LocalDate today = LocalDate.now();
        return workInfoRepository.findAll().stream()
                .filter(w -> w.getRequestTime() != null &&
                        w.getRequestTime().toLocalDate().isEqual(today))
                .toList();
    }

    @Override
    public ImageEntity save(ImageEntity image) {
        return imageRepository.save(image);
    }

    @Override
    public ImageEntity findById(Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("이미지 없음"));
    }

    @Override
    public ImageEntity findLatest() {
        return imageRepository.findTopByOrderByRegDateDesc();
    }

    @Override
    public Optional<WorkInfoEntity> findLatestEntranceWork() {
        return workInfoRepository.findTopByWork_WorkIdOrderByRequestTimeDesc(1);
    }

    @Override
    public List<WorkInfoEntity> findEntryBetween(LocalDateTime start, LocalDateTime end) {
        return workInfoRepository.findByEntryTimeBetween(start, end);
    }

    @Override
    public List<WorkInfoEntity> findExitBetween(LocalDateTime start, LocalDateTime end) {
        return workInfoRepository.findByExitTimeBetween(start, end);
    }
}
