package com.iot2ndproject.mobilityhub.domain.service_request.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ServiceRequestDTO {
    private Long id;
    private String userId;
    private String carNumber;
    private List<String> services;
    private String additionalRequest;
    private LocalDateTime createdAt;
    private String parkingStatus;
    private String carwashStatus;
    private String repairStatus;
    private String status;
    private String carState; // 차량 현재 위치 (노드 이름)

    // 간단 요금 정보(임시 계산용)
    private Integer parkingFee; // 주차 요금
    private Integer carwashFee; // 세차 요금
    private Integer repairFee;  // 정비 요금
    private Integer totalFee;   // 총액
}

