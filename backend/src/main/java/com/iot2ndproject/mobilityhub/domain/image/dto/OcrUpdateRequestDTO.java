package com.iot2ndproject.mobilityhub.domain.image.dto;

import lombok.Data;

@Data
public class OcrUpdateRequestDTO {
    private String carNumber;   // 수정된 번호판
}
