package com.iot2ndproject.mobilityhub.domain.repair.service;

import com.iot2ndproject.mobilityhub.domain.repair.dto.*;

import java.util.List;

public interface RepairService {

    List<StockStatusResponse> stockList();

    List<RepairResponseDTO> repairList();

    // 전체 조회(재고, 정비이용차량)
    ResponseDTO list();

    // 재고아이디로 재고찾기
    StockStatusResponse findByInventoryId(String inventoryId);

    //재고 추가
    void createStock(StockCreateRequest stock);

    // 재고 삭제
    void deleteStock(String inventoryId);

    // 재고 수량 변경
    void updateStockQuantity(String inventoryId, int stockQuantity);

    // 재고 이름,유형,수량,가격 수정
    void updateStockStatus(String inventoryId, StockUpdateRequest stockUpdateRequest);

    // 보고서 전체 조회
    List<ReportResponseDTO> reportList();

    // 보고서아이디 별 조회
    ReportResponseDTO findByReportId(String reportId);

    // 보고서 작성
    void reportWrite(ReportRequestDTO reportRequestDTO);

    // 보고서 수정
    void updateReport(String reportId, ReportRequestDTO reportRequestDTO);

    // 보고서 삭제
    void deleteReport(String reportId);
}
