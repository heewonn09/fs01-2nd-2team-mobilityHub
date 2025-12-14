package com.iot2ndproject.mobilityhub.domain.work.dto;

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
}

