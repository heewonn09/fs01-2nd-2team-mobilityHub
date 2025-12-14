package com.iot2ndproject.mobilityhub.domain.image.controller;

import com.iot2ndproject.mobilityhub.domain.image.dto.EntranceResponseDTO;
import com.iot2ndproject.mobilityhub.domain.image.dto.OcrEntryRequestDTO;
import com.iot2ndproject.mobilityhub.domain.image.dto.OcrUpdateRequestDTO;
import com.iot2ndproject.mobilityhub.domain.image.service.EntranceService;
import com.iot2ndproject.mobilityhub.domain.work.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/entrance")
@RequiredArgsConstructor
public class EntranceController {

    private final EntranceService entranceService;
    private final EntryService entryService;

    // 📸 카메라 → OCR 결과 수신
    @PostMapping("/ocr")
    public ResponseEntity<?> ocr(@RequestBody OcrEntryRequestDTO dto) {
        return ResponseEntity.ok(
                entranceService.receiveOcr(dto)
        );
    }

    // ✏️ OCR 번호 수정 (관리자)
    @PutMapping("/image/{imageId}/ocr")
    public ResponseEntity<?> updateOcr(
            @PathVariable Long imageId,
            @RequestBody OcrUpdateRequestDTO dto
    ) {
        entranceService.updateOcrNumber(imageId, dto.getCarNumber());
        return ResponseEntity.ok().build();
    }

    // ✅ 입차 승인
    @PostMapping("/{workId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long workId) {
        entryService.approveEntrance(workId);
        return ResponseEntity.ok().build();
    }
    // 🆕 최근 인식 번호판 조회
    @GetMapping("/latest")
    public ResponseEntity<EntranceResponseDTO> latest() {
        return ResponseEntity.ok(
                entranceService.getLatestEntrance()
        );
    }
}
