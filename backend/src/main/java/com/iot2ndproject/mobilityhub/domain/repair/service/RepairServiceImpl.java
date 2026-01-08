package com.iot2ndproject.mobilityhub.domain.repair.service;

import com.iot2ndproject.mobilityhub.domain.admin.dao.AdminDAO;
import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.parking.dao.ParkingDAO;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.repository.ParkingRepository;
import com.iot2ndproject.mobilityhub.domain.repair.dao.RepairDAO;
import com.iot2ndproject.mobilityhub.domain.repair.dto.*;
import com.iot2ndproject.mobilityhub.domain.repair.entity.ReportEntity;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.car.dao.UserCarDAO;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.global.util.DateRange;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RepairServiceImpl implements RepairService {
    private final RepairDAO repairDAO;
    private final UserCarDAO userCarDAO;
    private final AdminDAO adminDAO;
    private final ParkingDAO parkingDAO;

    private final ModelMapper modelMapper;

    // 금일 정비요청 리스트
    // 정비요청 = work_id: 2, 5
    @Override
    public List<RepairResponseDTO> findTodayWorkInfo(){

        LocalDateTime start = DateRange.todayStart();
        LocalDateTime end = DateRange.tomorrowStart();

        List<WorkInfoEntity> todayList = repairDAO.findByRequestTimeBetween(start, end);
        List<RepairResponseDTO> list = todayList.stream()
                .filter(entity -> entity.getWork().getWorkId() == 2 || entity.getWork().getWorkId() == 5)
                .map(RepairResponseDTO::new)
                .collect(Collectors.toList());

        return list;
    }

    // 재고 리스트
    @Override
    public List<StockStatusResponse> stockList() {
        List<StockStatusResponse> stockStatusResponseList = repairDAO.findStockAll().stream()
                .map(StockStatusResponse::new)
                .collect(Collectors.toList());

        return stockStatusResponseList;
    }

    // 아이디로 재고별 조회
    @Override
    public StockStatusResponse findByInventoryId(String inventoryId) {
        StockStatusEntity entity = repairDAO.findByInventoryId(inventoryId);

        StockStatusResponse response = StockStatusResponse.builder()
                .inventoryId(entity.getInventoryId())
                .productName(entity.getProductName())
                .stockCategory(entity.getStockCategory())
                .stockQuantity(entity.getStockQuantity())
                .updateTime(entity.getUpdateTime())
                .sectorId(entity.getSectorId().getSectorId())
                .build();

        return response;
    }

    // 재고 추가
    @Override
    public void createStock(StockCreateRequest stock) {
        ParkingEntity radmin = parkingDAO.findById("Radmin");

        StockStatusEntity entity = StockStatusEntity.builder()
                .inventoryId(stock.getInventoryId())
                .productName(stock.getProductName())
                .stockCategory(stock.getStockCategory())
                .stockQuantity(stock.getStockQuantity())
                .stockPrice(stock.getStockPrice())
                .minStockQuantity(stock.getMinStockQuantity())
                .sectorId(radmin)
                .stockUnits(stock.getStockUnits())
                .updateTime(LocalDateTime.now())
                .build();

        repairDAO.createStock(entity);
    }

    // 재고 수량만 수정
    @Override
    @Transactional
    public void updateStockQuantity(String inventoryId, int stockQuantity) {
        StockStatusEntity entity = repairDAO.findByInventoryId(inventoryId);

        if (entity == null) {
            throw new IllegalArgumentException("존재하지 않는 재고 ID: " + inventoryId);
        }

        entity.setStockQuantity(stockQuantity);
    }

    // 재고 이름,카테고리,수량 변경
    @Override
    public void updateStockStatus(StockUpdateRequest request) {
        StockStatusEntity entity = repairDAO.findByInventoryId(request.getInventoryId());

        entity.setProductName(request.getProductName());
        entity.setStockCategory(request.getStockCategory());
        entity.setStockQuantity(request.getStockQuantity());
        entity.setUpdateTime(LocalDateTime.now());

        repairDAO.updateStock(entity);

    }

    // 재고 삭제
    @Override
    public void deleteStock(String inventoryId) {
        repairDAO.deleteStock(inventoryId);
    }

    // 보고서 리스트
    @Override
    public List<ReportResponseDTO> reportList() {
        List<ReportResponseDTO> reportList = repairDAO.reportList().stream()
                .map(entity ->  {
                    ReportResponseDTO dto = new ReportResponseDTO(entity);
                    dto.setUserName(entity.getUserCar().getUser().getUserName());

                    return dto;
                })
                .collect(Collectors.toList());

        return reportList;
    }

    // 아디디 별 보고서 조회
    @Override
    public ReportResponseDTO findByReportId(String reportId) {
        ReportEntity entity = repairDAO.findByReportId(reportId);

        ReportResponseDTO dto = ReportResponseDTO.builder()
                .reportId(entity.getReportId())
                .carNumber(entity.getUserCar().getCar().getCarNumber())
                .userName(entity.getUserCar().getUser().getUserName())
                .repairTitle(entity.getRepairTitle())
                .repairDetail(entity.getRepairDetail())
                .repairAmount(entity.getRepairAmount())
                .build();

        return dto;
    }

    // 보고서 작성
    @Override
    public void reportWrite(ReportRequestDTO reportRequestDTO) {
        AdminEntity adminEntity = adminDAO.findByAdminId("Radmin");
        UserCarEntity userCarEntity = userCarDAO.findById(reportRequestDTO.getUserCarId());
        ReportEntity entity = ReportEntity.builder()
                .userCar(userCarEntity)
                .admin(adminEntity)
                .repairTitle(reportRequestDTO.getRepairTitle())
                .repairDetail(reportRequestDTO.getRepairDetail())
                .repairAmount(reportRequestDTO.getRepairAmount())
                .build();

        repairDAO.writeReport(entity);
    }

    // 보고서 수정
    @Override
    public void updateReport(ReportRequestDTO reportRequestDTO) {
        ReportEntity entity = repairDAO.findByReportId(reportRequestDTO.getReportId());

        entity.setRepairTitle(reportRequestDTO.getRepairTitle());
        entity.setRepairDetail(reportRequestDTO.getRepairDetail());
        entity.setRepairAmount(reportRequestDTO.getRepairAmount());

        repairDAO.updateReport(entity);
    }

    // 보고서 삭제
    @Override
    public void deleteReport(String reportId) {

        repairDAO.deleteReport(reportId);
    }

    // 정비 총금액
    @Override
    public List<ReportResponseDTO> repairAmount() {
        List<ReportEntity> entities = repairDAO.reportList();

        YearMonth thisMonth = YearMonth.now();

        // 이번 달 데이터 필터링 + DTO 변환
        return entities.stream()
                .filter(r -> {
                    String reportId = r.getReportId();
                    if (reportId.length() < 6) return false;
                    int year = Integer.parseInt(reportId.substring(0, 4));
                    int month = Integer.parseInt(reportId.substring(4, 6));
                    return YearMonth.of(year, month).equals(thisMonth);
                })
                .map(entity -> modelMapper.map(entity, ReportResponseDTO.class))
                .collect(Collectors.toList());
    }
}
