package com.iot2ndproject.mobilityhub.domain.repair.service;

import com.iot2ndproject.mobilityhub.domain.repair.dao.RepairDAO;
import com.iot2ndproject.mobilityhub.domain.repair.dto.*;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepairServiceImpl implements RepairService {
    private final RepairDAO repairDAO;
    private final ModelMapper modelMapper;

    // 정비존 메인페이지에 모든내용 보여주기 위한 방법
    @Override
    public ResponseDTO list() {
        List<StockStatusResponse> stockStatusList = repairDAO.findStockAll().stream()
                .map(repair -> modelMapper.map(repair, StockStatusResponse.class))
                .collect(Collectors.toList());

        List<RepairResponseDTO> repairList = repairDAO.findRequestAll().stream()
                .filter(response -> response.getWork().getWorkId() == 2 || response.getWork().getWorkId() == 5)
                .filter(response -> response.getRequestTime().toLocalDate().isEqual(LocalDate.now()))
                .map(repair -> {
                    RepairResponseDTO dto = modelMapper.map(repair, RepairResponseDTO.class);
                    if(repair.getUserCar().getCar() != null){
                        dto.setCar_number(repair.getUserCar().getCar().getCarNumber());
                    }
                    return dto;
                })
                .sorted(Comparator.comparing(response -> response.getRequestTime().toLocalDate()))
                .collect(Collectors.toList());


        return new ResponseDTO(stockStatusList, repairList);
    }

    @Override
    public StockStatusResponse findByInventoryId(String inventoryId) {
        StockStatusEntity findByInventoryId = repairDAO.findByInventoryId(inventoryId);

        return modelMapper.map(findByInventoryId, StockStatusResponse.class);
    }

    @Override
    public StockStatusResponse createStock(StockCreateRequest stock) {
        StockStatusEntity entiity = modelMapper.map(stock, StockStatusEntity.class);

        StockStatusEntity savedStock = repairDAO.createStock(entiity);

        return modelMapper.map(savedStock, StockStatusResponse.class);
    }

    @Override
    public void deleteStock(String inventoryId) {
        repairDAO.deleteStock(inventoryId);
    }

    @Override
    public StockStatusResponse updateStockQuantity(String inventoryId, int quantity) {
        StockStatusEntity entity = repairDAO.updateStockQuantity(inventoryId, quantity);

        return modelMapper.map(entity, StockStatusResponse.class);
    }

    @Override
    public StockStatusResponse updateStockStatus(String inventoryId, StockUpdateRequest stockUpdateRequest) {
        StockStatusEntity updatedEntity = repairDAO.updateStock(inventoryId, stockUpdateRequest);

        return modelMapper.map(updatedEntity, StockStatusResponse.class);
    }

}
