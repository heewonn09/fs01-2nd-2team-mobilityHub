package com.iot2ndproject.mobilityhub.domain.work.controller;

import com.iot2ndproject.mobilityhub.domain.work.dto.OcrEntryRequest;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.service.EntryService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/entry")
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;

    @PostMapping("/ocr")
    public ResponseEntity<?> createEntry(@RequestBody OcrEntryRequest req) {
        WorkInfoEntity work = entryService.handleEntry(req);
        return ResponseEntity.ok(work);
    }
}
