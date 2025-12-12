package com.iot2ndproject.mobilityhub.domain.repair.dao;

import com.iot2ndproject.mobilityhub.domain.repair.dto.StockUpdateRequest;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
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

    @Override
    public StockStatusEntity createStock(StockStatusEntity stock) {
        return stockStatusRepository.save(stock);
    }

    @Override
    public void deleteStock(String inventoryId) {
        stockStatusRepository.deleteById(inventoryId);
    }

    @Override
    public StockStatusEntity updateStockQuantity(String inventoryId, int quantity) {
        StockStatusEntity stock = stockStatusRepository.findByInventoryId(inventoryId);

        if(stock==null){
            throw new IllegalArgumentException("존재하지 않는 재고 ID : " + inventoryId);
        }

        stock.setStockQuantity(quantity);

        return stockStatusRepository.save(stock);
    }

    @Override
    public StockStatusEntity updateStock(String inventoryId, StockUpdateRequest stockUpdateRequest) {
        StockStatusEntity stock = stockStatusRepository.findByInventoryId(inventoryId);

        if (stock == null) {
            throw new IllegalArgumentException("존재하지 않는 재고 ID : " + inventoryId);
        }

        stock.setProductName(stockUpdateRequest.getProductName());
        stock.setStockCategory(stockUpdateRequest.getStockCategory());
        stock.setStockQuantity(stockUpdateRequest.getStockQuantity());
        stock.setStockPrice(stockUpdateRequest.getStockPrice());

        return stockStatusRepository.save(stock);
    }

    @Override
    public List<StockStatusEntity> findStockAll() {
        System.out.println("RepairDAOImpl 호출");
        return stockStatusRepository.findAll();
    }

    @Override
    public List<WorkInfoEntity> findRequestAll() {
        return workRepository.findAll();
    }

    @Override
    public StockStatusEntity findByInventoryId(String inventoryId) {
        return stockStatusRepository.findByInventoryId(inventoryId);
    }

}
