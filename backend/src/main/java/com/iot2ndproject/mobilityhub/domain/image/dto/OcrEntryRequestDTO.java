package com.iot2ndproject.mobilityhub.domain.image.dto;

import lombok.Data;

@Data
public class OcrEntryRequestDTO {

    private String cameraId;
    private String imagePath;
    private String ocrNumber;   // OCR 인식 번호
}
