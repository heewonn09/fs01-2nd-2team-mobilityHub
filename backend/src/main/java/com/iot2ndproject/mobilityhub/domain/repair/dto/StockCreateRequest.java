package com.iot2ndproject.mobilityhub.domain.repair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockCreateRequest {
    private String inventoryId;     // PK
    private String productName;
    private String stockCategory;
    private int stockQuantity;
    private int stockPrice;
    private String adminId;

    public StockCreateRequest(String inventoryId, String productName, String stockCategory, int stockQuantity, int stockPrice) {
        this.inventoryId = inventoryId;
        this.productName = productName;
        this.stockCategory = stockCategory;
        this.stockQuantity = stockQuantity;
        this.stockPrice = stockPrice;
        this.adminId = "Radmin";
    }
}
