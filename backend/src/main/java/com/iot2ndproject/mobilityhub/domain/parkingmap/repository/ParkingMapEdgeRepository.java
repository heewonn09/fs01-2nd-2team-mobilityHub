package com.iot2ndproject.mobilityhub.domain.parkingmap.repository;

import com.iot2ndproject.mobilityhub.domain.parkingmap.entity.ParkingMapEdgeEntity;
import com.iot2ndproject.mobilityhub.domain.parkingmap.entity.ParkingMapNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParkingMapEdgeRepository extends JpaRepository<ParkingMapEdgeEntity, Long> {

    List<ParkingMapEdgeEntity> findByFromNode(ParkingMapNodeEntity fromNode);
}
