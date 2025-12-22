package com.iot2ndproject.mobilityhub.domain.entry.service;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.EntranceEntryViewDTO;

import java.util.List;

public interface EntryService {

    List<EntranceEntryViewDTO> getTodayEntry();

    void approveEntrance(Long workId);
}
