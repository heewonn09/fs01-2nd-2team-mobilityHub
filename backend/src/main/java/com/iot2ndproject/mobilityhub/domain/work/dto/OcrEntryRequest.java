package com.iot2ndproject.mobilityhub.domain.work.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OcrEntryRequest {
    private String cameraId;   // 카메라 ID (Pi에서 전송)
    private String carNumber;  // OCR 인식 차량 번호
    private String imagePath;  // 촬영된 이미지 경로
}
