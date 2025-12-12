package com.iot2ndproject.mobilityhub.domain.repair.repository;

import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;



public interface StockStatusRepository extends JpaRepository<StockStatusEntity, String> {

    StockStatusEntity findByInventoryId(@RequestParam("inventoryId") String inventoryId);

    void deleteByInventoryId(@RequestParam("inventoryId") String inventoryId);
}
