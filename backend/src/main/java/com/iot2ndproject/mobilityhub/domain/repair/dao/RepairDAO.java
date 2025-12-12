package com.iot2ndproject.mobilityhub.domain.repair.dao;

import com.iot2ndproject.mobilityhub.domain.repair.dto.StockUpdateRequest;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface RepairDAO {

    // 재고 추가
    StockStatusEntity createStock(StockStatusEntity stock);

    // 재고 삭제
    void deleteStock(String inventoryId);

    // 재고 수량 변경
    StockStatusEntity updateStockQuantity(String inventoryId, int  quantity);

    // 재고 이름,유형,수량,가격 변경
    StockStatusEntity updateStock(String inventoryId, StockUpdateRequest stockUpdateRequest);

    // 전체 재고목록 조회
    List<StockStatusEntity> findStockAll();

    // 전체
    List<WorkInfoEntity> findRequestAll();

    StockStatusEntity findByInventoryId(@RequestParam("inventoryId") String inventoryId);
}
