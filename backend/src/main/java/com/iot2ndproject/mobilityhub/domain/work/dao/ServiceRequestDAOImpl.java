package com.iot2ndproject.mobilityhub.domain.work.dao;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.UserCarRepository;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ServiceRequestDAOImpl implements ServiceRequestDAO {

    private final WorkInfoRepository workInfoRepository;
    private final UserCarRepository userCarRepository;
    private final WorkRepository workRepository;

    @Override
    public WorkInfoEntity save(WorkInfoEntity entity) {
        return workInfoRepository.save(entity);
    }

    @Override
    public List<WorkInfoEntity> saveAll(Iterable<WorkInfoEntity> entities) {
        return workInfoRepository.saveAll(entities);
    }

    @Override
    public Optional<WorkInfoEntity> findById(Long id) {
        return workInfoRepository.findById(id);
    }

    @Override
    public List<WorkInfoEntity> findByUserIdOrderByRequestTimeDesc(String userId) {
        // 서비스 요청 이력만 조회(work_id가 NULL인 입/출차 로그 제외)
        return java.util.Objects.requireNonNull(
                workInfoRepository.findByUserCar_User_UserIdAndWorkIsNotNullOrderByRequestTimeDesc(userId)
        );
    }

    @Override
    public Optional<UserCarEntity> findByUser_UserIdAndCar_CarNumber(String userId, String carNumber) {
        return userCarRepository.findByUser_UserIdAndCar_CarNumber(userId, carNumber);
    }

    @Override
    public Optional<WorkEntity> findWorkById(int workId) {
        return workRepository.findById(workId);
    }
}
