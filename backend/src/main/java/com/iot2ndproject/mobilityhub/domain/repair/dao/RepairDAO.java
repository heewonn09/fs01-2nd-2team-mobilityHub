package com.iot2ndproject.mobilityhub.domain.repair.dao;

import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface RepairDAO {

    // 현재 정비요청한 차량 리스트 조회
//    List<WorkInfoEntity> findRequestAll();
    List<WorkInfoEntity> findByRequestTimeBetween( LocalDateTime start, LocalDateTime end);

    // 전체 재고목록 조회
    List<StockStatusEntity> findStockAll();

    // 재고ID별 상세조회
    StockStatusEntity findByInventoryId(String inventoryId);

    // 재고 추가
    void createStock(StockStatusEntity stock);

    // 재고 변경
    void updateStock(StockStatusEntity stockStatusEntity);

    // 재고 삭제
    void deleteStock(String inventoryId);

    // 보고서 리스트 조회
    List<ReportEntity> reportList();

    // 보고서 조회
    ReportEntity findByReportId(String reportId);

    // 보고서 작성
    void writeReport(ReportEntity entity);

    // 보고서 수정
    void updateReport(ReportEntity entity);

    // 보고서 삭제
    void deleteReport(String reportId);

}
