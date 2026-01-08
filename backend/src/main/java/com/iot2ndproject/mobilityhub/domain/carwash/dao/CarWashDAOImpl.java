package com.iot2ndproject.mobilityhub.domain.carwash.dao;


import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CarWashDAOImpl implements CarWashDAO{
    private final WorkInfoRepository workInfoRepository;

    // 세차 목록 가져오기
    @Override
    public List<WorkInfoEntity> carWashing() {
        return workInfoRepository.findAll();
    }
}
