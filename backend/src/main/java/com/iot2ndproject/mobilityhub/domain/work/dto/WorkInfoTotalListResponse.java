package com.iot2ndproject.mobilityhub.domain.work.dto;

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
public class WorkInfoTotalListResponse {
    private String carNumber;
    private String userName;
    private int carState;
    private String sectorId;
    private int workId;
    private LocalDateTime request_time;
    private LocalDateTime entry_time;
    private LocalDateTime exit_time;

    public WorkInfoTotalListResponse(WorkInfoEntity entity){
        if(entity.getUserCar() != null){
            this.carNumber = entity.getUserCar().getCar().getCarNumber();
            this.userName = entity.getUserCar().getUser().getUserName();
        }

        if(entity.getCarState() != null){
            this.carState = entity.getCarState().getNodeId();
        }

        if(entity.getSectorId() != null){
            this.sectorId = entity.getSectorId().getSectorId();
        }

        if (entity.getWork() != null){
            this.workId = entity.getWork().getWorkId();
        }
        
        this.request_time = entity.getRequestTime();
        this.entry_time = entity.getEntryTime();
        this.exit_time = entity.getExitTime();
    }
}
