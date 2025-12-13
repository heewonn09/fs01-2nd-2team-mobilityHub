package com.iot2ndproject.mobilityhub.domain.work.dto;

import lombok.Data;

import java.util.List;
import java.time.LocalDateTime;

@Data
public class ServiceRequestDTO {
    private Long id;
    private String userId;
    private String carNumber;
    private List<String> services;
    private String additionalRequest;
    private LocalDateTime createdAt;
    private String status;
    private String parkingStatus;
    private String carwashStatus;
    private String maintenanceStatus;
}

