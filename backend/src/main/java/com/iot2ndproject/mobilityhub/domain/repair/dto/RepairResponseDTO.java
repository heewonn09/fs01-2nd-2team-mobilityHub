package com.iot2ndproject.mobilityhub.domain.repair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairResponseDTO {
    private Long id;
    private int workId;
    private String car_number;
    private String carState;
    private LocalDateTime requestTime;


}
