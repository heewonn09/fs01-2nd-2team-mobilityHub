package com.iot2ndproject.mobilityhub.domain.repair.service;

import com.iot2ndproject.mobilityhub.domain.repair.dto.*;

import java.util.List;

public interface RepairService {

    // 금일 정비요청 리스트
    List<RepairResponseDTO> findTodayWorkInfo();

    // 재고현황 리스트
    List<StockStatusResponse> stockList();

    // 재고아이디로 재고별 조회
    StockStatusResponse findByInventoryId(String inventoryId);

    //재고 추가
    void createStock(StockCreateRequest stock);

    // 재고 수량 변경
    void updateStockQuantity(String inventoryId, int stockQuantity);

    // 재고 이름,유형,수량,가격 수정
    void updateStockStatus(StockUpdateRequest stockUpdateRequest);

    // 재고 삭제
    void deleteStock(String inventoryId);

    // 보고서 전체 조회
    List<ReportResponseDTO> reportList();

    // 아이디 별 보고서조회
    ReportResponseDTO findByReportId(String reportId);

    // 보고서 작성
    void reportWrite(ReportRequestDTO reportRequestDTO);

    // 보고서 수정
    void updateReport(ReportRequestDTO reportRequestDTO);

    // 보고서 삭제
    void deleteReport(String reportId);

    // 정비 보고서 월별 금액
    List<ReportResponseDTO> repairAmount();
}
