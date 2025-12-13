package com.iot2ndproject.mobilityhub.domain.work.service;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.repository.UserCarRepository;
import com.iot2ndproject.mobilityhub.domain.work.dao.ServiceRequestDAO;
import com.iot2ndproject.mobilityhub.domain.work.dto.ServiceRequestDTO;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestDAO serviceRequestDAO;

    private final UserCarRepository userCarRepository;
    private final WorkRepository workRepository;

    @Override
    @Transactional
    public ServiceRequestDTO create(ServiceRequestDTO dto) {
        if (dto.getUserId() == null || dto.getUserId().isBlank()) {
            throw new IllegalArgumentException("userId is required");
        }
        if (dto.getCarNumber() == null || dto.getCarNumber().isBlank()) {
            throw new IllegalArgumentException("carNumber is required");
        }
        if (dto.getServices() == null || dto.getServices().isEmpty()) {
            throw new IllegalArgumentException("services is required");
        }

        UserCarEntity userCar = userCarRepository
                .findByUser_UserIdAndCar_CarNumber(dto.getUserId(), dto.getCarNumber())
                .orElseThrow(() -> new IllegalArgumentException("UserCar not found for userId/carNumber"));

        List<WorkInfoEntity> entities = dto.getServices().stream()
                .distinct()
                .map(serviceType -> {
                    WorkEntity work = workRepository.findByWorkType(serviceType)
                            .orElseGet(() -> workRepository.save(new WorkEntity(serviceType)));

                    WorkInfoEntity workInfo = new WorkInfoEntity();
                    workInfo.setUserCar(userCar);
                    workInfo.setWork(work);
                    workInfo.setStatus("REQUESTED");
                    workInfo.setCarState("REQUESTED");

                    if ("maintenance".equalsIgnoreCase(serviceType) && dto.getAdditionalRequest() != null) {
                        workInfo.setAdditionalRequest(dto.getAdditionalRequest());
                    }
                    return workInfo;
                })
                .collect(Collectors.toList());

        List<WorkInfoEntity> saved = serviceRequestDAO.saveAll(entities);
        return convertToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestDTO> getHistory(String userId) {
        List<WorkInfoEntity> all = serviceRequestDAO.findByUserIdOrderByRequestTimeDesc(userId);

        return all.stream()
                .map(List::of)
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(ServiceRequestDTO::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ServiceRequestDTO> getLatest(String userId) {
        return getHistory(userId).stream().findFirst();
    }

    @Override
    @Transactional
    public boolean updateStatus(Long id, String status, String service) {
        Optional<WorkInfoEntity> optionalEntity = serviceRequestDAO.findById(id);
        if (optionalEntity.isEmpty()) {
            return false;
        }

        WorkInfoEntity representative = optionalEntity.get();

        if (service != null
                && representative.getWork() != null
                && representative.getWork().getWorkType() != null
                && !representative.getWork().getWorkType().equalsIgnoreCase(service)) {
            return false;
        }

        representative.setStatus(status);
        representative.setCarState(status);
        serviceRequestDAO.save(representative);
        return true;
    }

    private ServiceRequestDTO convertToDTO(List<WorkInfoEntity> group) {
        WorkInfoEntity representative = group.stream()
                .filter(w -> w.getRequestTime() != null)
                .min(Comparator.comparing(WorkInfoEntity::getRequestTime))
                .orElse(group.get(0));

        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setId(representative.getId());

        if (representative.getUserCar() != null && representative.getUserCar().getUser() != null) {
            dto.setUserId(representative.getUserCar().getUser().getUserId());
        }
        if (representative.getUserCar() != null && representative.getUserCar().getCar() != null) {
            dto.setCarNumber(representative.getUserCar().getCar().getCarNumber());
        }

        dto.setCreatedAt(representative.getRequestTime());

        List<String> services = group.stream()
                .map(w -> w.getWork() != null ? w.getWork().getWorkType() : null)
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .toList();
        dto.setServices(services);

        String additionalRequest = group.stream()
                .map(WorkInfoEntity::getAdditionalRequest)
                .filter(s -> s != null && !s.isBlank())
                .findFirst()
                .orElse(null);
        dto.setAdditionalRequest(additionalRequest);

        Map<String, String> serviceStatus = new HashMap<>();
        for (WorkInfoEntity w : group) {
            if (w.getWork() == null || w.getWork().getWorkType() == null) {
                continue;
            }
            serviceStatus.put(w.getWork().getWorkType().toLowerCase(), w.getStatus());
        }

        dto.setParkingStatus(serviceStatus.get("parking"));
        dto.setCarwashStatus(serviceStatus.get("carwash"));
        dto.setMaintenanceStatus(serviceStatus.get("maintenance"));

        dto.setStatus(calculateOverallStatus(group));
        return dto;
    }

    private String calculateOverallStatus(List<WorkInfoEntity> group) {
        List<String> statuses = group.stream()
                .map(WorkInfoEntity::getStatus)
                .filter(s -> s != null && !s.isBlank())
                .toList();

        if (statuses.isEmpty()) {
            return null;
        }

        boolean allDone = statuses.stream().allMatch(s -> s.equalsIgnoreCase("DONE"));
        boolean anyInProgress = statuses.stream().anyMatch(s -> s.equalsIgnoreCase("IN_PROGRESS"));

        if (allDone) {
            return "DONE";
        }
        if (anyInProgress) {
            return "IN_PROGRESS";
        }
        return "REQUESTED";
    }
}
