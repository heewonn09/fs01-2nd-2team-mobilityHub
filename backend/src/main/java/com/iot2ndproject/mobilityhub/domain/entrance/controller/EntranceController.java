package com.iot2ndproject.mobilityhub.domain.entrance.controller;

import com.iot2ndproject.mobilityhub.domain.entrance.dto.*;
import com.iot2ndproject.mobilityhub.domain.entrance.service.EntranceService;
import com.iot2ndproject.mobilityhub.domain.entry.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entrance")
@RequiredArgsConstructor
public class EntranceController {

    private final EntranceService entranceService;
    private final EntryService entryService;

    // 입차 승인
    @PostMapping("/{workId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long workId) {
        entryService.approveEntrance(workId);
        return ResponseEntity.ok().build();
    }

    // 최근 입차 조회
    @GetMapping("/latest")
    public ResponseEntity<EntranceResponseDTO> latest() {
        return ResponseEntity.ok(entranceService.getLatestEntrance());
    }

    // 작업 전체 목록
    @GetMapping("/work/list")
    public List<WorkInfoResponseDTO> workInfolist() {
        return entranceService.findAll();
    }

    // 오늘 작업만 전체 목록
    @GetMapping("/work/today")
    public List<WorkInfoResponseDTO> workInfoToday() {
        return entranceService.findAllToday();
    }


    // 금일 입차
    @GetMapping("/today/entry")
    public List<WorkInfoResponseDTO> getTodayEntry() {
        return entranceService.getTodayEntryDTO();
    }

    // 금일 출차
    @GetMapping("/today/exit")
    public List<WorkInfoResponseDTO> getTodayExit() {
        return entranceService.getTodayExitDTO();
    }

}
