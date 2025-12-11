package com.iot2ndproject.mobilityhub.domain.vehicle.repository;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarRepository extends JpaRepository<CarEntity,Long> {
    Optional<CarEntity> findByCarNumber(String carNumber);
}