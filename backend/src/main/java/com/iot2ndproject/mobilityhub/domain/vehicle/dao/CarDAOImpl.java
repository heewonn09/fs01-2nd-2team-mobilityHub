package com.iot2ndproject.mobilityhub.domain.vehicle.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.user.repository.UserRepository;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CarDAOImpl implements CarDAO{
    private final CarRepository carRepository;
    @Override
    public void save(CarEntity car) {
        carRepository.save(car);
    }

    @Override
    public CarEntity findByCarNumber(String carNumber) {
        return carRepository.findByCarNumber(carNumber).get();
    }
}
