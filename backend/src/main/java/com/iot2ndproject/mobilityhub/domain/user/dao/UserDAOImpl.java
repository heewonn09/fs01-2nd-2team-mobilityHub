package com.iot2ndproject.mobilityhub.domain.user.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserDAOImpl implements UserDAO{
    private final UserRepository userRepository;
    @Override
    public void create(UserEntity user) {
        if (userRepository.existsById(user.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }
        userRepository.save(user);
    }
    @Override
    public UserEntity findById(String userId) {
        return userRepository.findById(userId).get();
    }
}