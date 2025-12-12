package com.iot2ndproject.mobilityhub.domain.repair.service;

import com.iot2ndproject.mobilityhub.domain.repair.dto.*;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;

import java.util.List;

public interface RepairService {
    // 종합 조회(재고, 정비이용차량)
    ResponseDTO list();

    // 재고아이디로 재고찾기
    StockStatusResponse findByInventoryId(String inventoryId);

    //재고 추가
    StockStatusResponse createStock(StockCreateRequest stock);

    // 재고 삭제
    void deleteStock(String inventoryId);

    // 재고 수량 변경
    StockStatusResponse updateStockQuantity(String inventoryId, int quantity);

    // 재고 이름,유형,수량,가격 수정
    StockStatusResponse updateStockStatus(String inventoryId, StockUpdateRequest stockUpdateRequest);

}
