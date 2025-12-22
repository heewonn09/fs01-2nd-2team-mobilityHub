package com.iot2ndproject.mobilityhub.domain.car.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;

import java.util.Optional;

public interface CarDAO {

    // 차량 저장 (Service → DAO 규칙 때문에 필요)
    CarEntity save(CarEntity car);

    // 번호판으로 유저-차량 조회
    Optional<UserCarEntity> findUserCarByCarNumber(String carNumber);

}
