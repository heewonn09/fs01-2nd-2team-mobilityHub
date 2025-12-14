package com.iot2ndproject.mobilityhub.domain.repair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockCreateRequest {
    private String inventoryId;     // PK
    private String productName;
    private String stockCategory;
    private int stockQuantity;
    private int stockPrice;
    private String stockUnits;
}
