package com.iot2ndproject.mobilityhub.domain.user.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;


public interface UserDAO {
    void create(UserEntity user);
    UserEntity findById(String userId);
    void save(UserEntity user);
}
