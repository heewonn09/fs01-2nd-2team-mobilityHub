package com.iot2ndproject.mobilityhub.domain.repair.dto;

import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponseDTO {

    private String reportId;  // 보고서ID
    private int userCarId;
    private String carNumber;
    private String userName;
    private String repairTitle;  // 정비 내용 타이틀
    private String repairDetail;   // 정비 세부내용
    private int repairAmount;  //정비 청구금액

    public ReportResponseDTO(ReportEntity entity) {
        this.reportId = entity.getReportId();
        this.repairTitle = entity.getRepairTitle();
        this.repairDetail = entity.getRepairDetail();
        this.repairAmount = entity.getRepairAmount();

        if (entity.getUserCar() != null && entity.getUserCar().getCar() != null) {
            this.userCarId = Long.bitCount(entity.getUserCar().getId());
            this.carNumber = entity.getUserCar().getCar().getCarNumber();
        }
    }
}
