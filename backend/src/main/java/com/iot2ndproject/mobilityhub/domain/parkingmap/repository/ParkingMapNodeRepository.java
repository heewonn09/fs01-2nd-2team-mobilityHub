package com.iot2ndproject.mobilityhub.domain.parkingmap.repository;

import com.iot2ndproject.mobilityhub.domain.parkingmap.entity.ParkingMapNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingMapNodeRepository extends JpaRepository<ParkingMapNodeEntity, Integer> {
}
