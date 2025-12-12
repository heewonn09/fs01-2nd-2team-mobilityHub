package com.iot2ndproject.mobilityhub.domain.repair.dto;

import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockStatusResponse {
    private String inventoryId;
    private String productName;
    private String stockCategory;
    private int stockQuantity;
    private LocalDateTime updateTime;
    private ParkingEntity sectorId;

    public StockStatusResponse(StockStatusEntity stockStatusEntity) {
        this.inventoryId = stockStatusEntity.getInventoryId();
        this.productName = stockStatusEntity.getProductName();
        this.stockCategory = stockStatusEntity.getStockCategory();
        this.stockQuantity = stockStatusEntity.getStockQuantity();
        this.updateTime = stockStatusEntity.getUpdateTime();
    }
}
