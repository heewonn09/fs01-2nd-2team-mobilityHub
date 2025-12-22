package com.iot2ndproject.mobilityhub.domain.entry.service;

import com.iot2ndproject.mobilityhub.domain.entry.dao.EntryDAO;
import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryViewDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EntryServiceImpl implements EntryService {

    private final EntryDAO entryDAO;

    /**
     * 📊 금일 입차 조회
     */
    @Override
    public List<EntranceEntryViewDTO> getTodayEntry() {

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return entryDAO.findTodayEntry(start, end)
                .stream()
                .map(work -> {
                    EntranceEntryViewDTO dto = new EntranceEntryViewDTO();

                    dto.setId(work.getId());
                    dto.setEntryTime(work.getEntryTime());

                    if (work.getUserCar() != null && work.getUserCar().getCar() != null) {
                        dto.setCarNumber(work.getUserCar().getCar().getCarNumber());
                    }

                    if (work.getImage() != null) {
                        dto.setImagePath(work.getImage().getImagePath());
                        dto.setCameraId(work.getImage().getCameraId());
                    }

                    return dto;
                })
                .toList();
    }

    /**
     * ✅ 입차 승인
     */
    @Override
    public void approveEntrance(Long workId) {

        WorkInfoEntity workInfo = entryDAO.findWorkInfoById(workId)
                .orElseThrow(() -> new IllegalArgumentException("입차 정보 없음"));

        // 승인 시점 확정
        if (workInfo.getEntryTime() == null) {
            workInfo.setEntryTime(LocalDateTime.now());
        }

        entryDAO.save(workInfo);
    }
}
