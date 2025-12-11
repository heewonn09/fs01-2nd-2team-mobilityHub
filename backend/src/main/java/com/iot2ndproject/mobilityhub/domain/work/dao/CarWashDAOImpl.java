package com.iot2ndproject.mobilityhub.domain.work.dao;


import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.CarWashRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CarWashDAOImpl implements CarWashDAO{
    private final CarWashRepository repository;

//    @Override
//    public List<WorkInfoEntity> findByWorkId(int workId)
//    {
//        return repository.findByWork_WorkId(workId);
//    }

    @Override
    public List<WorkInfoEntity> carWashing() {
        return repository.findAll();
    }
}
