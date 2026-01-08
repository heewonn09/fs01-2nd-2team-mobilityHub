package com.iot2ndproject.mobilityhub.domain.carwash.service;

import com.iot2ndproject.mobilityhub.domain.carwash.dao.CarWashDAO;
import com.iot2ndproject.mobilityhub.domain.carwash.dto.WashResponse;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarWashServiceImpl implements CarWashService {
    private final CarWashDAO dao;
    private final ModelMapper modelMapper;

    @Override
    public List<WashResponse> findAll() {
        List<WorkInfoEntity> list = dao.carWashing();

        // 세차 요청 작업만 받아오기
        return list.stream()
                .filter(entity -> entity.getWork().getWorkId() == 3 || entity.getWork().getWorkId() == 4)
                .filter(entity -> entity.getRequestTime().toLocalDate().isEqual(LocalDate.now()))
                .map(w -> {
                    WashResponse dto = modelMapper.map(w, WashResponse.class);
                    if(w.getUserCar().getCar() != null){
                        dto.setCarNumber(w.getUserCar().getCar().getCarNumber());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
