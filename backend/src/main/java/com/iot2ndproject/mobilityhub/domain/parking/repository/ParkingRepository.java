package com.iot2ndproject.mobilityhub.domain.parking.repository;

import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRepository extends JpaRepository<ParkingEntity,String> {

}