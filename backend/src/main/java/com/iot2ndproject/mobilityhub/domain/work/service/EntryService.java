package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dto.EntranceEntryView;
import com.iot2ndproject.mobilityhub.domain.work.dto.OcrEntryRequest;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

import java.util.List;

public interface EntryService {

    WorkInfoEntity handleEntry(OcrEntryRequest req);

    List<EntranceEntryView> getTodayEntry();
    void approveEntrance(Long workId);
}
