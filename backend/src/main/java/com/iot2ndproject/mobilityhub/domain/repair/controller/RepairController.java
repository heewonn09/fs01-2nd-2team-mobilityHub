package com.iot2ndproject.mobilityhub.domain.repair.controller;

import com.iot2ndproject.mobilityhub.domain.repair.dto.*;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.repair.service.RepairService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/repair")
@RequiredArgsConstructor
public class RepairController {
    private final RepairService repairService;

    // 정비존페이지 들어갔을 때
    @GetMapping("/list")
    public ResponseDTO list() {
        return  repairService.list();
    }

    // 재고별 상세페이지
    @GetMapping("/detail")
    public StockStatusResponse detail(@RequestParam(name = "inventoryId") String inventoryId) {
        return repairService.findByInventoryId(inventoryId);
    }

    // 재고 추가
    @PostMapping("/create")
    public ResponseEntity<?> createStock(@RequestBody StockCreateRequest request) {
        try {
            StockStatusResponse created = repairService.createStock(request);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 재고 삭제
    @DeleteMapping("/detail/delete")
    public ResponseEntity<?> deleteStock(@RequestParam(name = "inventoryId") String inventoryId) {
        try {
            repairService.deleteStock(inventoryId);
            return ResponseEntity.ok("재고가 삭제되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 재고 수량 변경
    @PostMapping("/detail/quantity")
    public ResponseEntity<?> updateQuantity(@RequestParam(name = "inventoryId") String inventoryId, @RequestParam("quantity") int quantity) {
        StockStatusResponse stockStatusResponse = repairService.updateStockQuantity(inventoryId, quantity);
        return ResponseEntity.ok(stockStatusResponse);
    }

    // 재고 이름,유형,수량,가격 변경
    @PutMapping("/detail/update")
    public ResponseEntity<?> updateStockInfo(@RequestParam(name = "inventoryId") String inventoryId, @RequestBody StockUpdateRequest updateRequest) {
        repairService.updateStockStatus(inventoryId, updateRequest);
        return ResponseEntity.ok(HttpStatus.OK);
    }


}
