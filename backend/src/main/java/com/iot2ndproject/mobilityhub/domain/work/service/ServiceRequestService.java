package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.work.dto.ServiceRequestDTO;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestService {
    ServiceRequestDTO create(ServiceRequestDTO dto);
    List<ServiceRequestDTO> getHistory(String userId);
    Optional<ServiceRequestDTO> getLatest(String userId);
    boolean updateStatus(Long id, String status, String service);
}