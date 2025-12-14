package com.iot2ndproject.mobilityhub.domain.work.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot2ndproject.mobilityhub.domain.mqtt.MyPublisher;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.service.ParkingService;
import com.iot2ndproject.mobilityhub.domain.parkingmap.repository.ParkingMapNodeRepository;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.work.dao.ServiceRequestDAO;
import com.iot2ndproject.mobilityhub.domain.work.dto.ServiceRequestDTO;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestDAO serviceRequestDAO;
    private final ParkingMapNodeRepository mapNodeRepository;
    private final ParkingService parkingService;
    private final MyPublisher mqttPublisher;
    private final ObjectMapper objectMapper;

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
        UserCarEntity userCar = serviceRequestDAO.findByUser_UserIdAndCar_CarNumber(dto.getUserId(), dto.getCarNumber())
                .orElseThrow(() -> new IllegalArgumentException("UserCar not found for userId/carNumber"));

        // work.work_type은 아래 5개 타입 중 하나만 사용한다 (data.sql 기준)
        // 1) park
        // 2) repair
        // 3) carwash
        // 4) park,carwash
        // 5) park,repair
        List<String> services = dto.getServices().stream()
                .filter(s -> s != null && !s.isBlank())
                .flatMap(s -> java.util.Arrays.stream(s.split(",")))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .distinct()
                .collect(Collectors.toList());

        if (services.isEmpty()) {
            throw new IllegalArgumentException("services is required");
        }

        // 허용되지 않은 서비스 타입 방지
        boolean hasUnknown = services.stream().anyMatch(s -> !s.equals("park") && !s.equals("repair") && !s.equals("carwash"));
        if (hasUnknown) {
            throw new IllegalArgumentException("invalid services: " + services);
        }

        boolean hasPark = services.contains("park");
        boolean hasCarwash = services.contains("carwash");
        boolean hasRepair = services.contains("repair");

        // 비즈니스 규칙: 세차와 정비는 동시 선택 불가 (XOR)
        if (hasCarwash && hasRepair) {
            throw new IllegalArgumentException("세차와 정비는 동시에 선택할 수 없습니다.");
        }

        // 선택 조합을 work_id/work_type으로 매핑 (work 테이블 seed 1~5에 맞춤)
        final int workId;
        final String workType;
        if (hasPark && hasCarwash) {
            workId = 4;
            workType = "park,carwash";
        } else if (hasPark && hasRepair) {
            workId = 5;
            workType = "park,repair";
        } else if (hasCarwash) {
            workId = 3;
            workType = "carwash";
        } else if (hasRepair) {
            workId = 2;
            workType = "repair";
        } else if (hasPark) {
            workId = 1;
            workType = "park";
        } else {
            throw new IllegalArgumentException("services is required");
        }

        // work 엔티티는 DB seed(data.sql)에 존재하는 row를 work_id로 사용한다. (임의 생성 금지)
        WorkEntity work = serviceRequestDAO.findWorkById(workId)
                .orElseThrow(() -> new IllegalStateException("work_id not found in DB: " + workId + " (" + workType + ")"));
        if (work.getWorkType() == null || !work.getWorkType().equalsIgnoreCase(workType)) {
            throw new IllegalStateException("work table mismatch: id=" + workId + ", expected=" + workType + ", actual=" + work.getWorkType());
        }

        WorkInfoEntity workInfo = new WorkInfoEntity();
        workInfo.setUserCar(userCar);
        workInfo.setWork(work);

        // car_state는 parking_map_node.node_id (숫자)
        // 서비스 요청 생성 시 기본 위치는 '입구'(node_id=1)로 설정
        mapNodeRepository.findById(1)
                .ifPresentOrElse(
                        workInfo::setCarState,
                        () -> {
                            throw new IllegalStateException("입구 노드를 찾을 수 없습니다.");
                        }
                );

        // 정비(수리) 요청만 추가요청 저장
        if (hasRepair
                && dto.getAdditionalRequest() != null
                && !dto.getAdditionalRequest().isBlank()) {
            workInfo.setAdditionalRequest(dto.getAdditionalRequest());
        }

        // WorkInfoEntity 저장 (주차 옵션 유무와 관계없이 저장 필요)
        WorkInfoEntity saved;
        
        // 주차 옵션이 있으면 빈자리 확인 및 할당
        if (hasPark) {
            if (!parkingService.hasAvailableSpace()) {
                throw new IllegalStateException("사용 가능한 주차 공간이 없습니다. 잠시 후 다시 시도해주세요.");
            }
            // 주차 공간 자동 할당 (첫 번째 빈 공간)
            // WorkInfoEntity가 저장된 후에 할당해야 하므로 임시로 저장 후 업데이트
            WorkInfoEntity tempSaved = serviceRequestDAO.save(workInfo);
            try {
                ParkingEntity allocatedParking = parkingService.allocateFirstAvailableSpace(tempSaved.getId());
                tempSaved.setSectorId(allocatedParking);
                saved = serviceRequestDAO.save(tempSaved);
            } catch (Exception e) {
                // 할당 실패 시 예외 전파
                throw new IllegalStateException("주차 공간 할당에 실패했습니다: " + e.getMessage());
            }
        } else {
            // 주차 옵션이 없는 경우 단순 저장
            saved = serviceRequestDAO.save(workInfo);
        }

        return convertToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestDTO> getHistory(String userId) {
        String nonNullUserId = java.util.Objects.requireNonNull(userId, "userId");
        List<WorkInfoEntity> all = serviceRequestDAO.findByUserIdOrderByRequestTimeDesc(nonNullUserId);

        if (all == null || all.isEmpty()) {
            return List.of();
        }

        // work_info 1건 = 서비스 요청 1건
        return all.stream()
                .map(this::convertToDTO)
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
        Long nonNullId = java.util.Objects.requireNonNull(id, "id");
        Optional<WorkInfoEntity> optionalEntity = serviceRequestDAO.findById(nonNullId);
        if (optionalEntity.isEmpty()) {
            return false;
        }

        WorkInfoEntity workInfo = java.util.Objects.requireNonNull(optionalEntity.get());

        // service 파라미터가 있으면, 해당 요청(work_type)에 포함된 서비스인지 확인
        if (service != null) {
            String workType = (workInfo.getWork() != null) ? workInfo.getWork().getWorkType() : null;
            if (workType == null || !containsWorkType(workType, service)) {
                return false;
            }
        }

        // status 컬럼 제거: entry_time / exit_time 기반으로 상태를 기록 (건물 출입구 기준)
        if (status != null) {
            if (status.equalsIgnoreCase("IN_PROGRESS")) {
                if (workInfo.getEntryTime() == null) {
                    workInfo.setEntryTime(LocalDateTime.now());
                }
            } else if (status.equalsIgnoreCase("DONE")) {
                if (workInfo.getExitTime() == null) {
                    workInfo.setExitTime(LocalDateTime.now());
                }
            }
        }

        serviceRequestDAO.save(workInfo);
        return true;
    }

    private ServiceRequestDTO convertToDTO(WorkInfoEntity representative) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setId(representative.getId());

        if (representative.getUserCar() != null && representative.getUserCar().getUser() != null) {
            dto.setUserId(representative.getUserCar().getUser().getUserId());
        }
        if (representative.getUserCar() != null && representative.getUserCar().getCar() != null) {
            dto.setCarNumber(representative.getUserCar().getCar().getCarNumber());
        }

        dto.setCreatedAt(representative.getRequestTime());

        List<String> services = parseWorkTypes(representative);
        dto.setServices(services);

        String additionalRequest = (representative.getAdditionalRequest() != null && !representative.getAdditionalRequest().isBlank())
                ? representative.getAdditionalRequest()
                : null;
        dto.setAdditionalRequest(additionalRequest);

        String status = deriveStatus(representative);
        dto.setStatus(status);

        dto.setParkingStatus(services.contains("park") ? status : null);
        dto.setCarwashStatus(services.contains("carwash") ? status : null);
        dto.setRepairStatus(services.contains("repair") ? status : null);
        return dto;
    }

    private String deriveStatus(WorkInfoEntity w) {
        if (w.getExitTime() != null) {
            return "DONE";
        }
        if (w.getEntryTime() != null) {
            return "IN_PROGRESS";
        }
        return "REQUESTED";
    }

    private List<String> parseWorkTypes(WorkInfoEntity workInfo) {
        if (workInfo == null || workInfo.getWork() == null || workInfo.getWork().getWorkType() == null) {
            return List.of();
        }

        return java.util.Arrays.stream(workInfo.getWork().getWorkType().split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .distinct()
                .sorted(Comparator.comparingInt(this::servicePriority).thenComparing(s -> s))
                .collect(Collectors.toList());
    }

    private boolean containsWorkType(String workType, String service) {
        if (workType == null || service == null) {
            return false;
        }
        String target = service.trim().toLowerCase();
        return java.util.Arrays.stream(workType.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .anyMatch(s -> s.equals(target));
    }

    // work_type 정렬을 위한 우선순위: park -> carwash -> repair
    private int servicePriority(String service) {
        if (service == null) {
            return 999;
        }
        String s = service.trim().toLowerCase();
        if ("park".equals(s)) {
            return 0;
        }
        if ("carwash".equals(s)) {
            return 1;
        }
        if ("repair".equals(s)) {
            return 2;
        }
        return 999;
    }

    @Override
    @Transactional
    public void completeService(Long workInfoId, String stage) {
        if (workInfoId == null) {
            throw new IllegalArgumentException("workInfoId는 필수입니다.");
        }
        if (stage == null || stage.isBlank()) {
            throw new IllegalArgumentException("stage는 필수입니다.");
        }

        // WorkInfoEntity 조회
        Optional<WorkInfoEntity> optionalWorkInfo = serviceRequestDAO.findById(workInfoId);
        if (optionalWorkInfo.isEmpty()) {
            throw new IllegalArgumentException("작업 정보를 찾을 수 없습니다: workInfoId=" + workInfoId);
        }

        WorkInfoEntity workInfo = optionalWorkInfo.get();

        // 차량 번호 추출
        String carNumber = null;
        if (workInfo.getUserCar() != null && workInfo.getUserCar().getCar() != null) {
            carNumber = workInfo.getUserCar().getCar().getCarNumber();
        }

        if (carNumber == null) {
            throw new IllegalStateException("차량 번호를 찾을 수 없습니다.");
        }

        // RC카에 서비스 완료 신호 발행
        String carId = carNumber.replaceAll("\\s+", "");
        String topic = "rccar/" + carId + "/service";
        Map<String, String> payload = new HashMap<>();
        payload.put("stage", stage.toLowerCase());
        payload.put("status", "done");

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            mqttPublisher.sendToMqtt(jsonPayload, topic);
            System.out.println(">>> 서비스 완료 신호 발행: " + topic + " | " + jsonPayload);
        } catch (Exception e) {
            throw new RuntimeException("MQTT 신호 발행 실패: " + e.getMessage(), e);
        }
    }
}
