package com.iot2ndproject.mobilityhub.domain.user.dao;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import com.iot2ndproject.mobilityhub.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
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
        }else{
            userRepository.save(user);
        }
        throw new RuntimeException("가입이 완료되었습니다.");
    }
    @Override
    public UserEntity findById(String userId) {
        return userRepository.findById(userId).get();
    }
}
