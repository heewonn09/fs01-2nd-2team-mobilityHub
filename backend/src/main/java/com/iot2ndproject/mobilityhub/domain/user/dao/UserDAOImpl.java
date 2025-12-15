package com.iot2ndproject.mobilityhub.domain.user.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

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
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    @Override
    public void save(UserEntity user) {
        userRepository.save(user);
    }

    // 유저 전체 목록 불러오기
    @Override
    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }
}
