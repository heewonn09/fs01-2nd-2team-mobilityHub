package com.iot2ndproject.mobilityhub.domain.repair.dao;

import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.repair.repository.ReportRepository;
import com.iot2ndproject.mobilityhub.domain.repair.repository.StockStatusRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class RepairDAOImpl implements RepairDAO {
    private final StockStatusRepository stockStatusRepository;
    private final WorkInfoRepository workInfoRepository;
    private final ReportRepository repairReportRepository;

    // 재고 리스트
    @Override
    public List<StockStatusEntity> findStockAll() {
        return stockStatusRepository.findAll();
    }

    // work_info테이블에서 오늘인 데이터만 추출
    @Override
    public List<WorkInfoEntity> findByRequestTimeBetween(LocalDateTime start, LocalDateTime end) {
        return workInfoRepository.findByRequestTimeBetween(start, end);
    }

    // 재고 추가
    @Override
    public void createStock(StockStatusEntity stock) {
        stockStatusRepository.save(stock);
    }

    // 재고 삭제
    @Override
    public void deleteStock(String inventoryId) {
        stockStatusRepository.deleteByInventoryId(inventoryId);
    }

    // 재고 수정
    @Override
    public void updateStock(StockStatusEntity entity) {
        stockStatusRepository.save(entity);
    }

    // 아이디별 재고 조회
    @Override
    public StockStatusEntity findByInventoryId(String inventoryId) {
        return stockStatusRepository.findByInventoryId(inventoryId);
    }

    // 전체 보고서 조회
    @Override
    public List<ReportEntity> reportList() {
        return repairReportRepository.findAll();
    }

    // 아이디별 보고서 조회
    @Override
    public ReportEntity findByReportId(String reportId) {
        return repairReportRepository.findByReportId(reportId);
    }

    // 보고서 작성
    @Override
    public void writeReport(ReportEntity entity) {
        repairReportRepository.save(entity);
    }

    // 보고서 수정
    @Override
    public void updateReport(ReportEntity entity) {
        repairReportRepository.save(entity);
    }

    // 보고서 삭제
    @Override
    public void deleteReport(String reportId) {
        repairReportRepository.deleteByReportId(reportId);
    }
}
