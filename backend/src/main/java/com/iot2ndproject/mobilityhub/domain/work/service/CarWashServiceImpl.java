package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dao.CarWashDAO;
import com.iot2ndproject.mobilityhub.domain.work.dto.WashResponse;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
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

//    @Override
//    public List<WashResponse> findByWokrId(int workId) {
//        System.out.println("작업 장소 찾기"+workId);
//
//
//
//        // DB에서 workId로 1차 조회
//        List<WorkInfoEntity> list = dao.findByWorkId(workId);
//
//        return list.stream()
//                .filter(w -> w.getWork() != null &&
//                        (w.getWork().getWorkId() == 3 || w.getWork().getWorkId() == 4))
//                .filter(w -> w.getRequestTime().toLocalDate().isEqual(LocalDate.now()))
//                .filter(w -> "carWashIn".equals(w.getCarState()))
//                .map(w -> {
//                    WashResponse dto = modelMapper.map(w, WashResponse.class);
//                    if (w.getCar() != null) {
//                        dto.setCarNumber(w.getCar().getCarNumber()); // 엔티티에서 번호 꺼내서 DTO에 넣기
//                    }
//                    return dto;
//                })
//                .collect(Collectors.toList());
//        }


    @Override
    public List<WashResponse> findAll() {
        List<WorkInfoEntity> list = dao.carWashing();

        return list.stream()
                .filter(w -> w.getWork() != null
                && w.getWork().getWorkType() != null
                && w.getWork().getWorkType().equalsIgnoreCase("carwash"))
                .filter(w -> w.getRequestTime().toLocalDate().isEqual(LocalDate.now()))
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
