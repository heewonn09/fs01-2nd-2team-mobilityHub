package com.iot2ndproject.mobilityhub.domain.repair.service;

import com.iot2ndproject.mobilityhub.domain.admin.dao.AdminDAO;
import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.repository.ParkingRepository;
import com.iot2ndproject.mobilityhub.domain.repair.dao.RepairDAO;
import com.iot2ndproject.mobilityhub.domain.repair.dto.*;
import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.dao.UserCarDAO;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RepairServiceImpl implements RepairService {
    private final RepairDAO repairDAO;
    private final UserCarDAO userCarDAO;
    private final AdminDAO adminDAO;

    private final ParkingRepository parkingRepository;


    // (임시) 재고 리스트
    @Override
    public List<StockStatusResponse> stockList() {
        return repairDAO.findStockAll().stream()
                .map(StockStatusResponse::new)
                .collect(Collectors.toList());
    }

    // (임시) 정비요청 리스트
    @Override
    public List<RepairResponseDTO> repairList() {
        return repairDAO.findRequestAll().stream()
                .filter(entity -> entity.getWork().getWorkId() == 2 || entity.getWork().getWorkId() == 5)
                .map(RepairResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 정비존 메인페이지에 모든내용 보여주기 위한 방법
    @Override
    public ResponseDTO list() {
        // 재고 리스트
        List<StockStatusResponse> stockStatusList =
                repairDAO.findStockAll().stream()
                        .map(StockStatusResponse::new)
                        .collect(Collectors.toList());

        // 정비 요청 리스트
        List<RepairResponseDTO> repairList =
                repairDAO.findRequestAll().stream()
                        .filter(entity -> entity.getWork().getWorkId() == 2 || entity.getWork().getWorkId() == 5)
                        .filter(entity -> entity.getRequestTime().toLocalDate().isEqual(LocalDate.now()))
                        .map(RepairResponseDTO::new)
                        .sorted(Comparator.comparing(RepairResponseDTO::getId))
                        .collect(Collectors.toList());

        return new ResponseDTO(stockStatusList, repairList);
    }

    @Override
    public StockStatusResponse findByInventoryId(String inventoryId) {
        StockStatusEntity entity = repairDAO.findByInventoryId(inventoryId);

        return StockStatusResponse.builder()
                .inventoryId(entity.getInventoryId())
                .productName(entity.getProductName())
                .stockCategory(entity.getStockCategory())
                .stockQuantity(entity.getStockQuantity())
                .updateTime(entity.getUpdateTime())
                .sectorId(entity.getSectorId().getSectorId())
                .build();
    }

    @Override
    public void createStock(StockCreateRequest stock) {
        ParkingEntity parkingEntity = parkingRepository.findBySectorId("Ramin");

        StockStatusEntity entity = StockStatusEntity.builder()
                .inventoryId(stock.getInventoryId())
                .productName(stock.getProductName())
                .stockCategory(stock.getStockCategory())
                .stockQuantity(stock.getStockQuantity())
                .stockPrice(stock.getStockPrice())
                .sectorId(parkingEntity)
                .stockUnits(stock.getStockUnits())
                .updateTime(LocalDateTime.now())
                .build();

        repairDAO.createStock(entity);
    }

    @Override
    public void deleteStock(String inventoryId) {
        repairDAO.deleteStock(inventoryId);
    }

    @Transactional
    @Override
    public void updateStockQuantity(String inventoryId, int stockQuantity) {
        StockStatusEntity entity = repairDAO.findByInventoryId(inventoryId);

        if (entity == null) {
            throw new IllegalArgumentException("존재하지 않는 재고 ID: " + inventoryId);
        }

        entity.setStockQuantity(stockQuantity);
    }

    @Override
    public void updateStockStatus(String inventoryId, StockUpdateRequest request) {
        StockStatusEntity entity = repairDAO.findByInventoryId(inventoryId);
        entity.setProductName(request.getProductName());
        entity.setStockCategory(request.getStockCategory());
        entity.setStockQuantity(request.getStockQuantity());
        entity.setStockPrice(request.getStockPrice());

        repairDAO.updateStock(entity);
    }

    @Override
    public List<ReportResponseDTO> reportList() {
        return repairDAO.reportList().stream()
                .map(report -> {
                    ReportResponseDTO dto = new ReportResponseDTO();

                    dto.setReportId(report.getReportId());
                    dto.setCarNumber(report.getUserCar().getCar().getCarNumber());
                    dto.setUserName(report.getUserCar().getUser().getUserName());
                    dto.setRepairTitle(report.getRepairTitle());
                    dto.setRepairDetail(report.getRepairDetail());
                    dto.setRepairAmount(report.getRepairAmount());

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ReportResponseDTO findByReportId(String reportId) {
        ReportEntity entity = repairDAO.findByReportId(reportId);

        ReportResponseDTO dto = new ReportResponseDTO();

        dto.setReportId(entity.getReportId());
        dto.setCarNumber(entity.getUserCar().getCar().getCarNumber());
        dto.setUserName(entity.getUserCar().getUser().getUserName());
        dto.setRepairTitle(entity.getRepairTitle());
        dto.setRepairDetail(entity.getRepairDetail());
        dto.setRepairAmount(entity.getRepairAmount());
        return dto;
    }

    @Override
    public void reportWrite(ReportRequestDTO reportRequestDTO) {
        AdminEntity adminEntity = adminDAO.findByAdminId("Radmin");
        UserCarEntity userCarEntity = userCarDAO.findByCarNumber(reportRequestDTO.getCarNumber());
        ReportEntity entity = new ReportEntity();

        entity.setUserCar(userCarEntity);
        entity.setAdmin(adminEntity);
        entity.setRepairTitle(reportRequestDTO.getRepairTitle());
        entity.setRepairDetail(reportRequestDTO.getRepairDetail());
        entity.setRepairAmount(reportRequestDTO.getRepairAmount());

        repairDAO.writeReport(entity);
    }

    @Override
    public void updateReport(String reportId, ReportRequestDTO reportRequestDTO) {
        ReportEntity entity = repairDAO.findByReportId(reportId);
        entity.setRepairTitle(reportRequestDTO.getRepairTitle());
        entity.setRepairDetail(reportRequestDTO.getRepairDetail());
        entity.setRepairAmount(reportRequestDTO.getRepairAmount());

        repairDAO.updateReport(entity);
    }

    @Override
    public void deleteReport(String reportId) {
        ReportEntity entity = repairDAO.findByReportId(reportId);

        repairDAO.deleteReport(entity.getReportId());
    }
}
