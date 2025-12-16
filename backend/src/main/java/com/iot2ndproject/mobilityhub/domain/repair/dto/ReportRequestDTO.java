package com.iot2ndproject.mobilityhub.domain.repair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDTO {
    private String reportId;
    private int userCarId;
    private String repairTitle;  // 정비 내용 타이틀
    private String repairDetail;   // 정비 세부내용
    private int repairAmount;  //정비 청구금액
}
