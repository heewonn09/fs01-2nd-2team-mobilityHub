package com.iot2ndproject.mobilityhub.domain.repair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponseDTO {

    private String reportId;  // 보고서ID
    private String carNumber;
    private String userName;
    private String repairTitle;  // 정비 내용 타이틀
    private String repairDetail;   // 정비 세부내용
    private int repairAmount;  //정비 청구금액
}
