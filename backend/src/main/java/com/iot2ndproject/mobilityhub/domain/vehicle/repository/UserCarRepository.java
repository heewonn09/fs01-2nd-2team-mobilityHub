package com.iot2ndproject.mobilityhub.domain.vehicle.repository;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCarRepository extends JpaRepository<UserCarEntity,Long> {
    List<UserCarEntity> findByUser_UserId(String userId);

    java.util.Optional<UserCarEntity> findByUser_UserIdAndCar_CarNumber(String userId, String carNumber);
    UserCarEntity findByCarCarNumber(String carNumber);
}
