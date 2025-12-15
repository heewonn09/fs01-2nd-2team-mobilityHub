package com.iot2ndproject.mobilityhub.domain.work.controller;

import com.iot2ndproject.mobilityhub.domain.work.dto.PlateUpdateRequest;
import com.iot2ndproject.mobilityhub.domain.work.dto.WorkInfoResponseDTO;
import com.iot2ndproject.mobilityhub.domain.work.service.WorkInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entrance")
@RequiredArgsConstructor
public class WorkInfoController {

    private final WorkInfoService workInfoService;

    //작업 전체 목록
    @GetMapping("/work/list")
    public List<WorkInfoResponseDTO> workInfolist(){
        List<WorkInfoResponseDTO> list = workInfoService.findAll();

        return list;
    }

    // ✔ 금일 입차
    @GetMapping("/today/entry")
    public List<WorkInfoResponseDTO> getTodayEntry() {
        return workInfoService.getTodayEntryDTO();
    }

    // ✔ 금일 출차
    @GetMapping("/today/exit")
    public List<WorkInfoResponseDTO> getTodayExit() {
        return workInfoService.getTodayExitDTO();
    }

    // ✔ 번호판 수정
    @PutMapping("/{id}/plate")
    public ResponseEntity<?> updatePlate(
            @PathVariable Long id,
            @RequestBody PlateUpdateRequest request
    ) {
        workInfoService.updatePlateNumber(id, request.getCarNumber());
        return ResponseEntity.ok().build();
    }
}
