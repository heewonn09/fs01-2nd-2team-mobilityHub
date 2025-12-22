package com.iot2ndproject.mobilityhub.domain.car.dao;

import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.car.repository.CarRepository;
import com.iot2ndproject.mobilityhub.domain.car.repository.UserCarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CarDAOImpl implements CarDAO {

    private final UserCarRepository userCarRepository;
    private final CarRepository carRepository;

    @Override
    public CarEntity save(CarEntity car) {
        return carRepository.save(car);
    }

    @Override
    public Optional<UserCarEntity> findUserCarByCarNumber(String carNumber) {
        return userCarRepository.findByCar_CarNumber(carNumber);
    }
}
