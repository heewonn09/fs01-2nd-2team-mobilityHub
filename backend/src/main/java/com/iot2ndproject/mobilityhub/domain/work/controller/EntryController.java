package com.iot2ndproject.mobilityhub.domain.work.controller;

import com.iot2ndproject.mobilityhub.domain.work.dto.OcrEntryRequest;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.service.EntryService;
import com.iot2ndproject.mobilityhub.domain.work.service.WorkInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entry")
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;
    private final WorkInfoService workInfoService;


    @PostMapping("/ocr")
    public WorkInfoEntity createEntry(@RequestBody OcrEntryRequest req) {
        return entryService.handleEntry(req);
    }

    @GetMapping("/today/entry")
    public List<WorkInfoResponseDTO> todayEntry() {
        return workInfoService.getTodayEntryDTO();
    }
}
