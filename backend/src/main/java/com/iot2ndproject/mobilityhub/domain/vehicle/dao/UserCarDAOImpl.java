package com.iot2ndproject.mobilityhub.domain.vehicle.dao;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.UserCarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserCarDAOImpl implements UserCarDAO{
    private final UserCarRepository userCarRepository;

    @Override
    public void save(UserCarEntity userCar) {
        userCarRepository.save(userCar);
    }

    @Override
    public UserCarEntity findByCarNumber(String carNumber) {
        return null;
    }

    @Override
    public java.util.List<UserCarEntity> findByUserId(String userId) {
        return userCarRepository.findByUser_UserId(userId);
    }
}
