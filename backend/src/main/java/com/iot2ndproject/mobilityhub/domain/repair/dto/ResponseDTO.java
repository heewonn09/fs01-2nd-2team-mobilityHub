package com.iot2ndproject.mobilityhub.domain.repair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDTO {
    private List<StockStatusResponse> stockStatusList;
    private List<RepairResponseDTO> repairList;
}
