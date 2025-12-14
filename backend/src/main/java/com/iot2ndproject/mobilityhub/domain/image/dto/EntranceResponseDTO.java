package com.iot2ndproject.mobilityhub.domain.image.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EntranceResponseDTO {

    private Long workId;
    private Long imageId;
    private String ocrNumber;              // OCR 인식
    private String correctedOcrNumber;     // 수정된 번호
    private String registeredCarNumber;    // user_car → car

    private boolean match;                 // 일치 여부

    private String carNumber;   // OCR or 수정된 번호
    private String imagePath;
    private String cameraId;

    private LocalDateTime time;
    private String carState;
}
