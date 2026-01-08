package com.iot2ndproject.mobilityhub.domain.service_request.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot2ndproject.mobilityhub.global.mqtt.MyPublisher;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parking.service.ParkingService;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.ParkingMapNodeRepository;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import com.iot2ndproject.mobilityhub.domain.repair.repository.ReportRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.dao.ServiceRequestDAO;
import com.iot2ndproject.mobilityhub.domain.service_request.dto.ServiceRequestDTO;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
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
    private final ReportRepository reportRepository;

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
                        ? Optional.empty()
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
                .flatMap(s -> Arrays.stream(s.split(",")))
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
        String nonNullUserId = Objects.requireNonNull(userId, "userId");
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
        Long nonNullId = Objects.requireNonNull(id, "id");
        Optional<WorkInfoEntity> optionalEntity = serviceRequestDAO.findById(nonNullId);
        if (optionalEntity.isEmpty()) {
            return false;
        }

        WorkInfoEntity workInfo = Objects.requireNonNull(optionalEntity.get());

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

        // =========================
        // 간단 요금 계산 로직 (데모용)
        // - 주차: 출차 완료 시, 시간당 2000원 (올림)
        // - 세차: 완료 시 8000원 고정
        // - 정비: 완료 시 DB의 repair_amount만 청구
        // =========================
        Integer parkingFee = 0;
        Integer carwashFee = 0;
        Integer repairFee = 0;

        // 주차 요금: entry~exit 시간으로 계산, 시간당 2000원(올림)
        if (hasPark && representative.getEntryTime() != null && representative.getExitTime() != null) {
            try {
                long minutes = java.time.Duration.between(representative.getEntryTime(), representative.getExitTime()).toMinutes();
                long hours = (long) Math.ceil(Math.max(0, minutes) / 60.0);
                parkingFee = (int) (hours * 2000);
            } catch (Exception e) {
                System.err.println("주차 요금 계산 오류: " + e.getMessage());
                parkingFee = 0;
            }
        }

        // 세차 고정 요금: 완료 시 8000원
        if (hasCarwash && "DONE".equalsIgnoreCase(carwashStatus)) {
            carwashFee = 8000;
        }

        // 정비 요금: 완료 시 repair_report.repair_amount
        if (hasRepair && "DONE".equalsIgnoreCase(repairStatus)) {
            int repairExtraFee = 0;

            try {
                Long userCarId = representative.getUserCar() != null ? representative.getUserCar().getId() : null;
                if (userCarId != null) {
                    var report = reportRepository.findTopByUserCar_IdOrderByReportIdDesc(userCarId);
                    if (report != null) {
                        repairExtraFee = Math.max(0, report.getRepairAmount());
                    }
                }
            } catch (Exception e) {
                System.err.println("정비 추가요금(repair_amount) 조회 오류: " + e.getMessage());
                repairExtraFee = 0;
            }

            repairFee = repairExtraFee;
        }

        dto.setParkingFee(parkingFee);
        dto.setCarwashFee(carwashFee);
        dto.setRepairFee(repairFee);
        dto.setTotalFee(parkingFee + carwashFee + repairFee);
        
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

        return Arrays.stream(workInfo.getWork().getWorkType().split(","))
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
        return Arrays.stream(workType.split(","))
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
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("stage", stage.toLowerCase());
        payload.put("status", "done");
        payload.put("workInfoId", workInfoId);

        // 다음 이동 경로(route) 포함: RC카가 "서비스 완료" 수신 후 자동으로 다음 목적지로 출발할 수 있도록
        String workType = (workInfo.getWork() != null) ? workInfo.getWork().getWorkType() : null;
        String normalizedWorkType = (workType != null) ? workType.trim().toLowerCase() : "";
        boolean hasPark = normalizedWorkType.contains("park");
        int parkingNodeId = resolveParkingNodeId(workInfo);
        payload.put("workType", normalizedWorkType);
        payload.put("route", routeService.calculateNextRouteAfterService(stage, hasPark, parkingNodeId));

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            mqttPublisher.sendToMqtt(jsonPayload, topic);
            System.out.println(">>> 서비스 완료 신호 발행: " + topic + " | " + jsonPayload);
        } catch (Exception e) {
            throw new RuntimeException("MQTT 신호 발행 실패: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public Map<String, Object> callVehicle(Long workInfoId) {
        if (workInfoId == null) {
            throw new IllegalArgumentException("workInfoId is required");
        }

        // WorkInfoEntity 조회
        Optional<WorkInfoEntity> optionalWorkInfo = serviceRequestDAO.findById(workInfoId);
        if (optionalWorkInfo.isEmpty()) {
            throw new IllegalArgumentException("작업 정보를 찾을 수 없습니다.");
        }

        WorkInfoEntity workInfo = optionalWorkInfo.get();

        // car_state(=parking_map_node) 기반으로 주차 여부 판단
        if (workInfo.getCarState() == null) {
            throw new IllegalArgumentException("차량 위치 정보가 없습니다.");
        }

        int currentNodeId = workInfo.getCarState().getNodeId();
        String nodeName = workInfo.getCarState().getNodeName();

        // 주차 노드: 5(주차_1), 7(주차_2), 9(주차_3)
        if (currentNodeId != 5 && currentNodeId != 7 && currentNodeId != 9) {
            String currentLocation = nodeName != null ? nodeName : "알 수 없음";
            throw new IllegalArgumentException("주차 구역에 있는 차량만 호출할 수 있습니다. 현재 위치: " + currentLocation);
        }

        // 차량 번호 추출
        String carNumber = null;
        if (workInfo.getUserCar() != null && workInfo.getUserCar().getCar() != null) {
            carNumber = workInfo.getUserCar().getCar().getCarNumber();
        }
        if (carNumber == null) {
            throw new IllegalArgumentException("차량 번호를 찾을 수 없습니다.");
        }

        // 주차 노드에서 출구까지 경로 계산
        List<Integer> exitRoute = routeService.calculateExitRoute(currentNodeId);

        // RC카에 호출 신호 발행
        String topic = "rccar/" + carNumber + "/call";
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("action", "call");
        payload.put("route", exitRoute);
        payload.put("workInfoId", workInfoId);

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            mqttPublisher.sendToMqtt(jsonPayload, topic);
            System.out.println(">>> 차량 호출 신호 발행: " + topic + " | " + jsonPayload);
        } catch (Exception e) {
            throw new RuntimeException("MQTT 차량 호출 신호 발행 실패: " + e.getMessage(), e);
        }

        return Map.of(
                "ok", true,
                "workInfoId", workInfoId,
                "carNumber", carNumber,
                "currentNodeId", currentNodeId,
                "route", exitRoute
        );
    }

    @Override
    public void publishRouteCommand(ServiceRequestDTO dto) {
        if (dto == null || dto.getId() == null) {
            throw new IllegalArgumentException("workInfoId is required");
        }

        // WorkInfoEntity 기준으로 workType/차량번호를 정확히 조회
        WorkInfoEntity workInfo = serviceRequestDAO.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("작업 정보를 찾을 수 없습니다: workInfoId=" + dto.getId()));

        String carNumber = null;
        if (workInfo.getUserCar() != null && workInfo.getUserCar().getCar() != null) {
            carNumber = workInfo.getUserCar().getCar().getCarNumber();
        }
        if (carNumber == null) {
            throw new IllegalStateException("차량 번호를 찾을 수 없습니다.");
        }

        String workType = (workInfo.getWork() != null) ? workInfo.getWork().getWorkType() : null;
        if (workType == null || workType.isBlank()) {
            throw new IllegalStateException("workType을 찾을 수 없습니다.");
        }

        String normalizedWorkType = workType.trim().toLowerCase();
        List<Integer> route;
        if ("park".equals(normalizedWorkType)) {
            // park 단독은 "주차 노드에서 대기"가 목적이므로, 할당된 주차 구역(P01/P02/P03)에 맞춰 경로를 보냄
            int parkingNodeId = resolveParkingNodeId(workInfo);
            route = routeService.calculateParkingRoute(parkingNodeId);
        } else {
            // carwash/repair/복합은 1차 목적지(세차/정비)에서 대기하도록 초기 경로만 발행
            route = routeService.calculateRoute(workType);
        }

        String topic = "rccar/" + carNumber + "/command";
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("workInfoId", workInfo.getId());
        payload.put("workType", normalizedWorkType);
        payload.put("route", route);

        try {
            String jsonPayload = objectMapper.writeValueAsString(payload);
            mqttPublisher.sendToMqtt(jsonPayload, topic);
            System.out.println(">>> RC카 경로 명령 발행: " + topic + " | " + jsonPayload);
        } catch (Exception e) {
            throw new RuntimeException("MQTT 경로 명령 발행 실패: " + e.getMessage(), e);
        }
    }

    /**
     * WorkInfoEntity에 할당된 주차 섹터(P01/P02/P03)를 parking_map_node(5/7/9)로 매핑
     * - P01 -> 주차_1(nodeId=5)
     * - P02 -> 주차_2(nodeId=7)
     * - P03 -> 주차_3(nodeId=9)
     *
     * 섹터가 없거나 알 수 없으면 기본값(주차_1)을 사용.
     */
    private int resolveParkingNodeId(WorkInfoEntity workInfo) {
        try {
            if (workInfo == null || workInfo.getSectorId() == null || workInfo.getSectorId().getSectorId() == null) {
                return 5;
            }
            String sectorId = workInfo.getSectorId().getSectorId().trim().toUpperCase();
            return switch (sectorId) {
                case "P01" -> 5;
                case "P02" -> 7;
                case "P03" -> 9;
                default -> 5;
            };
        } catch (Exception ignored) {
            return 5;
        }
    }
}
