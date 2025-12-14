// 재고현황 테이블

package com.iot2ndproject.mobilityhub.domain.repair.entity;

import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stockStatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockStatusEntity {
    @Id
    @Column(columnDefinition = "CHAR(3)")
    private String inventoryId; // 재고 ID

    @Column(nullable = false)
    private String productName; // 제품이름

    @Column(nullable = false)
    private String stockCategory; // 카테고리

    @Column(nullable = false)
    private String stockUnits; // 단위

    @Column(nullable = false)
    private int stockQuantity; // 수량
    
    @Column(nullable = false)
    private int minStockQuantity; // 최소재고

    @Column(nullable = false)
    private int stockPrice; // 개당 가격

    @UpdateTimestamp
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updateTime; // 업데이트 날짜

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sectorId")
    private ParkingEntity sectorId;

    // 재고 수량 변동시 <- 필요없으면 삭제 또는 변경
    public StockStatusEntity(String inventoryId, int stockQuantity){
        this.inventoryId = inventoryId;
        this.stockQuantity = stockQuantity;
        this.updateTime = LocalDateTime.now();
    }

    // 제품 등록시
    public StockStatusEntity(String inventoryId, String productName, String stockCategory, int stockQuantity) {
        this.inventoryId = inventoryId;
        this.productName = productName;
        this.stockCategory = stockCategory;
        this.stockQuantity = stockQuantity;
        this.updateTime = LocalDateTime.now();
    }

}
