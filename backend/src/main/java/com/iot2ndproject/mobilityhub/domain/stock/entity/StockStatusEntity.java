// 재고현황 테이블

package com.iot2ndproject.mobilityhub.domain.stock.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "stockStatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockStatusEntity {
    @Id
    @Column(columnDefinition = "CHAR(3)")
    private String InventoryId; // 재고 ID

    @Column(nullable = false)
    private String productName; // 제품이름

    @Column(nullable = false)
    private String stockCategory; // 카테고리

    @Column(nullable = false)
    private int stockQuantity; // 수량

    @UpdateTimestamp
    private LocalDateTime updateTime; // 업데이트 날짜

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "sectorId")
    private ParkingEntity sectorId;

    // 재고 수량 변동시 <- 필요없으면 삭제 또는 변경
    public StockStatusEntity(String inventoryId, int stockQuantity){
        this.InventoryId = inventoryId;
        this.stockQuantity = stockQuantity;
        this.updateTime = LocalDateTime.now();
    }

    // 제품 등록시
    public StockStatusEntity(String inventoryId, String productName, String stockCategory, int stockQuantity) {
        this.InventoryId = inventoryId;
        this.productName = productName;
        this.stockCategory = stockCategory;
        this.stockQuantity = stockQuantity;
        this.updateTime = LocalDateTime.now();
    }

}
