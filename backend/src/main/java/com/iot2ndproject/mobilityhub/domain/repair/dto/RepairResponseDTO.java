package com.iot2ndproject.mobilityhub.domain.repair.dto;

import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
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
    private String additionalRequest;
    private int carState;
    private LocalDateTime requestTime;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    public RepairResponseDTO(WorkInfoEntity entity) {
        this.id = entity.getId();
        this.requestTime = entity.getRequestTime();
        this.entryTime = entity.getEntryTime();
        this.exitTime = entity.getExitTime();

        if (entity.getWork() != null) {
            this.workId = entity.getWork().getWorkId();
        }

        if (entity.getAdditionalRequest() != null) {
            this.additionalRequest = entity.getAdditionalRequest();
        }

        if (entity.getUserCar() != null && entity.getUserCar().getCar() != null) {
            this.car_number = entity.getUserCar().getCar().getCarNumber();
        }

        if (entity.getCarState() != null) {
            this.carState = entity.getCarState().getNodeId();
        }
    }
}
