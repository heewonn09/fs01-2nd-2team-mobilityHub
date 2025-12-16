package com.iot2ndproject.mobilityhub.domain.vehicle.dao;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.UserCarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserCarDAOImpl implements UserCarDAO{
    private final UserCarRepository userCarRepository;

    @Override
    public UserCarEntity findById(long id) {
        return userCarRepository.findById(id);
    }

    @Override
    public List<UserCarEntity> findByUser_UserId(String userId) {
        return List.of();
    }

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
