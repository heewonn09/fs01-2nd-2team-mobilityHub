package com.iot2ndproject.mobilityhub.domain.vehicle.repository;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCarRepository extends JpaRepository<UserCarEntity,Long> {
    UserCarEntity findByCarCarNumber(String carNumber);
}
