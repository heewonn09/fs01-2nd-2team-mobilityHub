package com.iot2ndproject.mobilityhub.domain.repair.controller;

import com.iot2ndproject.mobilityhub.domain.repair.dto.*;
import com.iot2ndproject.mobilityhub.domain.repair.service.RepairService;
import com.iot2ndproject.mobilityhub.domain.work.service.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/repair")
@RequiredArgsConstructor
public class RepairController {
    private final RepairService repairService;
    private final ServiceRequestService serviceRequestService;

    @GetMapping("/a")
    public List<RepairResponseDTO> repairList(){
        return repairService.repairList();
    }

    @GetMapping("/b")
    public List<StockStatusResponse> stockList(){
        return repairService.stockList();
    }

    // 정비존페이지 들어갔을 때
    @GetMapping("/list")
    public ResponseDTO list() {
        return repairService.list();
    }

    // 재고별 상세페이지
    @GetMapping("/detail")
    public StockStatusResponse detail(@RequestParam(name = "inventoryId") String inventoryId) {
        return repairService.findByInventoryId(inventoryId);
    }

    // 재고 추가
    @PostMapping("/create")
    public ResponseEntity<?> createStock(@RequestBody StockCreateRequest request) {
        repairService.createStock(request);

        return ResponseEntity.ok("재고가 추가되었습니다.");
    }

    // 재고 수량 변경
    @PostMapping("/detail/update/quantity")
    public ResponseEntity<?> updateStockQuantity(@RequestParam("inventoryId") String inventoryId, @RequestBody StockQuantityUpdateRequest request) {
        repairService.updateStockQuantity(inventoryId, request.getStockQuantity());

        return ResponseEntity.ok(inventoryId+"의 수량이+"+request.getStockQuantity()+"로 변경되었습니다.");
    }

    // 재고 이름/유형/수량/가격 변경
    @PostMapping("/detail/update")
        public ResponseEntity<?> updateStock(@RequestParam("inventoryId") String inventoryId, @RequestBody StockUpdateRequest request) {
        repairService.updateStockStatus(inventoryId, request);

        return ResponseEntity.ok(inventoryId+"의 내용이 변경되었습니다.");
    }

    // 재고 삭제
    @DeleteMapping("/detail/delete")
    public ResponseEntity<?> deleteStock(@RequestParam(name = "inventoryId") String inventoryId) {
        repairService.deleteStock(inventoryId);
        return ResponseEntity.ok("재고가 삭제되었습니다.");
    }

    // 재고 수량 변경
    @PostMapping("/detail/quantity")
    public ResponseEntity<?> updateQuantity(@RequestParam(name = "inventoryId") String inventoryId, @RequestParam("quantity") int quantity) {
        repairService.updateStockQuantity(inventoryId, quantity);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    // 재고 이름,유형,수량,가격 변경
    @PutMapping("/detail/update")
    public ResponseEntity<?> updateStockInfo(@RequestParam(name = "inventoryId") String inventoryId, @RequestBody StockUpdateRequest updateRequest) {
        repairService.updateStockStatus(inventoryId, updateRequest);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    // 보고서 전체 조회
    @GetMapping("/report/list")
    public List<ReportResponseDTO> reportList(){
        return repairService.reportList();
    }

    // 보고서아이디 별 조회
    @GetMapping("/report")
    public ReportResponseDTO reportByReportId(@RequestParam(name = "reportId") String reportId){
        return repairService.findByReportId(reportId);
    }

    // 정비완료 보고서 작성
    @PostMapping("/report/write")
    public ResponseEntity<?> writeReport(@RequestBody ReportRequestDTO reportRequestDTO){
        repairService.reportWrite(reportRequestDTO);
        return ResponseEntity.ok("보고서가 생성되었습니다.");
    }

    // 보고서 수정
    @PostMapping("/report/update")
    public ResponseEntity<?> updateReport(@RequestParam(name = "reportId") String reportId, @RequestBody ReportRequestDTO reportRequestDTO){
        repairService.updateReport(reportId, reportRequestDTO);
        return ResponseEntity.ok(reportId+"보고서가 수정되었습니다.");
    }

    // 보고서 삭제
    @DeleteMapping("/report/delete")
    public ResponseEntity<?> deleteReport(@RequestParam(name = "reportId") String reportId){
        repairService.deleteReport(reportId);
        return ResponseEntity.ok(reportId+"아이디를 가진 보고서가 삭제되었습니다.");
    }

    /**
     * 정비 작업 완료 처리
     * @param workInfoId 작업 정보 ID
     * @return 성공 여부
     */
    @PostMapping("/complete")
    public ResponseEntity<?> completeRepair(@RequestParam Long workInfoId) {
        try {
            serviceRequestService.completeService(workInfoId, "repair");
            return ResponseEntity.ok(Map.of("message", "정비 완료"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

}