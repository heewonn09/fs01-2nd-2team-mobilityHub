package com.iot2ndproject.mobilityhub.domain.repair.dto;

import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockUpdateRequest {
    private String productName;   // 이름
    private String stockCategory; // 유형
    private int stockQuantity;    // 수량
    private int stockPrice;       // 가격
}
