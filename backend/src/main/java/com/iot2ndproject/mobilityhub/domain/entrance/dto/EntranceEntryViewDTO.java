package com.iot2ndproject.mobilityhub.domain.entrance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntranceEntryViewDTO {

    // work_info
    private Long id;
    private LocalDateTime requestTime;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    // user → car
    private String carNumber;

    // image
    private Long imageId;
    private String imagePath;
    private String cameraId;
}
