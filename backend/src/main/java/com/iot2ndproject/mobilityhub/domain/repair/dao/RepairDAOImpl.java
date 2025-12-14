package com.iot2ndproject.mobilityhub.domain.repair.dao;

import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.repair.repository.RepairReportRepository;
import com.iot2ndproject.mobilityhub.domain.repair.repository.RepairRequestRepository;
import com.iot2ndproject.mobilityhub.domain.repair.repository.StockStatusRepository;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class RepairDAOImpl implements RepairDAO {
    private final StockStatusRepository stockStatusRepository;
    private final RepairRequestRepository workRepository;
    private final RepairReportRepository repairReportRepository;


    // 모든 재고 호출
    @Override
    public List<StockStatusEntity> findStockAll() {
        return stockStatusRepository.findAll();
    }

    // work_info 테이블 모두 호출
    @Override
    public List<WorkInfoEntity> findRequestAll() {
        return workRepository.findAll();
    }

    // 재고 신규 추가
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
