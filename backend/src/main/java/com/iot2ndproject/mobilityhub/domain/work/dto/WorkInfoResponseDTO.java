package com.iot2ndproject.mobilityhub.domain.work.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkInfoResponseDTO {
    private Long id;              // work_info id
    private String carNumber;     // 차량 번호

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private String imagePath;     // 번호판 이미지 경로
    private String cameraId;      // 어떤 카메라에서 찍힌건지
}
