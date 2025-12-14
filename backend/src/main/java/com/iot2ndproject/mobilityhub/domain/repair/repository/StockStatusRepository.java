package com.iot2ndproject.mobilityhub.domain.repair.repository;

import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StockStatusRepository extends JpaRepository<StockStatusEntity, String> {

    StockStatusEntity findByInventoryId(String inventoryId);

    void deleteByInventoryId(String inventoryId);
}
