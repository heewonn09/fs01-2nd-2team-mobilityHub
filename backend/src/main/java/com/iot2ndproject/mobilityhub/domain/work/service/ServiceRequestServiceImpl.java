package com.iot2ndproject.mobilityhub.domain.work.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot2ndproject.mobilityhub.domain.mqtt.MyPublisher;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.service.ParkingService;
import com.iot2ndproject.mobilityhub.domain.parkingmap.repository.ParkingMapNodeRepository;
import com.iot2ndproject.mobilityhub.domain.parkingmap.service.RouteService;
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
    private final RouteService routeService;
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

        // 입력 시 공백/하이픈 등으로 인한 불일치를 방지하기 위해 차번호를 정규화해서 조회
        String normalizedCarNumber = normalizeCarNumber(dto.getCarNumber());
        String originalCarNumber = dto.getCarNumber().trim();

        UserCarEntity userCar = serviceRequestDAO.findByUser_UserIdAndCar_CarNumber(dto.getUserId(), originalCarNumber)
                .or(() -> normalizedCarNumber.equals(originalCarNumber)
                        ? java.util.Optional.empty()
                        : serviceRequestDAO.findByUser_UserIdAndCar_CarNumber(dto.getUserId(), normalizedCarNumber))
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

        String overallStatus = deriveStatus(representative);
        dto.setStatus(overallStatus);

        // =========================
        // 서비스별 상태 계산
        // - REQUESTED: 입차 전(대기)
        // - IN_PROGRESS: 현재 진행중(동시에 2개 이상 "중"이 되지 않도록 순서 기반으로 계산)
        // - DONE: 출차(전체 완료)
        // =========================
        boolean hasPark = services.contains("park");
        boolean hasCarwash = services.contains("carwash");
        boolean hasRepair = services.contains("repair");

        String parkingStatus = null;
        String carwashStatus = null;
        String repairStatus = null;

        // =========================
        // 노드 기반 서비스별 상태 계산
        // - 사이클 안에서 중복으로 밟는 노드가 없으므로, 노드 ID로 단계 판별
        // - 세차: 10(세차_1)에서 진행중, 이후 노드에서 완료
        // - 정비: 13(정비_1)에서 진행중, 이후 노드에서 완료
        // - 주차: 5,7,9(주차_1,2,3)에서 진행중, 출구(20) 또는 exitTime 시 완료
        // =========================
        Integer currentNodeId = representative.getCarState() != null 
                ? representative.getCarState().getNodeId() 
                : null;
        String currentNodeName = representative.getCarState() != null 
                ? representative.getCarState().getNodeName() 
                : null;

        if ("REQUESTED".equalsIgnoreCase(overallStatus)) {
            // 입차 전: 모두 대기
            if (hasPark) parkingStatus = "REQUESTED";
            if (hasCarwash) carwashStatus = "REQUESTED";
            if (hasRepair) repairStatus = "REQUESTED";
        } else if ("DONE".equalsIgnoreCase(overallStatus)) {
            // 출차(exitTime): 모두 완료
            if (hasPark) parkingStatus = "DONE";
            if (hasCarwash) carwashStatus = "DONE";
            if (hasRepair) repairStatus = "DONE";
        } else { 
            // IN_PROGRESS: 노드 ID 기반으로 판별
            // ===== 세차 상태 =====
            if (hasCarwash) {
                // 세차 노드: 10
                // 세차 이전 노드: 1, 2 (경로: 1 → 2 → 10 → ...)
                // 세차 이후 노드: 15, 17, 18, 19, 3, 4, 5, 6, 7, 8, 9, 21, 22, 23, 20
                if (currentNodeId == null || currentNodeId == 1 || currentNodeId == 2) {
                    carwashStatus = "REQUESTED"; // 세차 전 (대기)
                } else if (currentNodeId == 10) {
                    carwashStatus = "IN_PROGRESS"; // 세차 중
                } else {
                    carwashStatus = "DONE"; // 세차 완료
                }
            }

            // ===== 정비 상태 =====
            if (hasRepair) {
                // 정비 노드: 13
                // 정비 이전 노드: 1, 2, 12 (경로: 1 → 2 → 12 → 13 → ...)
                // 정비 이후 노드: 14, 17, 18, 19, 3, 4, 5, 6, 7, 8, 9, 21, 22, 23, 20
                if (currentNodeId == null || currentNodeId == 1 || currentNodeId == 2 || currentNodeId == 12) {
                    repairStatus = "REQUESTED"; // 정비 전 (대기)
                } else if (currentNodeId == 13) {
                    repairStatus = "IN_PROGRESS"; // 정비 중
                } else {
                    repairStatus = "DONE"; // 정비 완료
                }
            }

            // ===== 주차 상태 =====
            if (hasPark) {
                // 주차 노드: 5, 7, 9
                // 주차 이전: 세차/정비 + 이동 구간 (기점_2(3) 전까지는 대기, 주차 구간 전까지 대기)
                // 주차 중: 5, 7, 9에 있을 때
                // 주차 완료: 출구(20)로 이동 중 또는 도착

                // 복합 서비스에서 주차는 세차/정비 이후에 진행됨
                // park,carwash: 세차 완료 후(노드 15 이후부터) 주차 구간 진입
                // park,repair: 정비 완료 후(노드 14 이후부터) 주차 구간 진입
                
                // 주차 노드에 있으면 주차 중
                if (currentNodeId != null && (currentNodeId == 5 || currentNodeId == 7 || currentNodeId == 9)) {
                    parkingStatus = "IN_PROGRESS"; // 주차 중
                } else if (currentNodeId != null && (currentNodeId == 21 || currentNodeId == 22 || currentNodeId == 23 
                        || currentNodeId == 19 || currentNodeId == 20)) {
                    // 주차 후 출차 이동 중 (기점_13~15, 기점_12, 출구)
                    parkingStatus = "DONE"; // 주차 완료
                } else if (currentNodeName != null && currentNodeName.startsWith("주차_")) {
                    // nodeName으로 보정
                    parkingStatus = "IN_PROGRESS";
                } else {
                    // 그 외는 대기 (세차/정비 구간 또는 주차 전 이동 구간)
                    parkingStatus = "REQUESTED";
                }
            }
        }

        dto.setParkingStatus(parkingStatus);
        dto.setCarwashStatus(carwashStatus);
        dto.setRepairStatus(repairStatus);
        
        // carState 매핑 (노드 이름)
        if (representative.getCarState() != null && representative.getCarState().getNodeName() != null) {
            dto.setCarState(representative.getCarState().getNodeName());
        } else {
            dto.setCarState(null);
        }
        
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

    private String normalizeCarNumber(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) {
            return trimmed;
        }
        return trimmed.replaceAll("\\s+", "").replace("-", "");
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
    public void completeService(int workInfoId, String stage) {
        // WorkInfoEntity 조회
        Optional<WorkInfoEntity> optionalWorkInfo = serviceRequestDAO.findById(Long.valueOf(workInfoId));
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
        String carId = carNumber;
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
