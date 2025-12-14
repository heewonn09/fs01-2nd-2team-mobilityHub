package com.iot2ndproject.mobilityhub.domain.work.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot2ndproject.mobilityhub.domain.mqtt.MyPublisher;
import com.iot2ndproject.mobilityhub.domain.parkingmap.service.RouteService;
import com.iot2ndproject.mobilityhub.domain.work.dao.ServiceRequestDAO;
import com.iot2ndproject.mobilityhub.domain.work.dto.ServiceRequestDTO;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.service.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/service-request")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;
    private final MyPublisher mqttPublisher;
    private final RouteService routeService;
    private final ObjectMapper objectMapper;
    private final ServiceRequestDAO serviceRequestDAO;

    @PostMapping
    public ResponseEntity<?> createServiceRequest(@RequestBody ServiceRequestDTO dto) {
        try {
            ServiceRequestDTO created = serviceRequestService.create(dto);

            // MQTT 경로 명령 발행
            try {
                publishRouteCommand(created);
            } catch (Exception mqttEx) {
                System.err.println("MQTT publish 실패: " + mqttEx.getMessage());
                // MQTT 실패는 서비스 요청 성공 자체에 영향 주지 않음
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage(), "class", e.getClass().getSimpleName()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequestDTO>> getServiceHistory(@RequestParam("userId") String userId) {
        try {
            List<ServiceRequestDTO> history = serviceRequestService.getHistory(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<ServiceRequestDTO> getLatestServiceRequest(@RequestParam("userId") String userId) {
        try {
            Optional<ServiceRequestDTO> latest = serviceRequestService.getLatest(userId);
            return latest.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.noContent().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/status")
    public ResponseEntity<?> updateServiceStatus(
            @RequestParam Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "service", required = false) String service) {
        try {
            boolean updated = serviceRequestService.updateStatus(id, status, service);
            if (updated) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * ServiceRequestDTO → MQTT rccar/{carId}/command 발행
     * 
     * 주의: 주차 옵션이 있는 경우, ServiceRequestServiceImpl에서 이미 빈자리를 확인하고 할당한 후
     * 이 메서드가 호출됩니다. 따라서 여기서는 추가 빈자리 확인이 필요 없습니다.
     */
    private void publishRouteCommand(ServiceRequestDTO dto) throws Exception {
        if (dto == null || dto.getServices() == null || dto.getServices().isEmpty()) {
            return;
        }

        // services 리스트를 work_type 형식으로 변환 (park,carwash 등)
        String workType = String.join(",", dto.getServices());
        
        // 주차 옵션이 있는 경우, ServiceRequestServiceImpl에서 이미 빈자리를 확인하고 할당했음
        // 여기서는 경로 계산만 수행
        List<Integer> route = routeService.calculateRoute(workType);

        // carId는 carNumber 또는 id 기반 (단순 예시)
        String carId = dto.getCarNumber() != null ? dto.getCarNumber().replaceAll("\\s+", "") : "default";

        // MQTT 페이로드 구성
        Map<String, Object> payload = new HashMap<>();
        payload.put("route", route);
        payload.put("workType", workType);

        String jsonPayload = objectMapper.writeValueAsString(payload);
        String topic = "rccar/" + carId + "/command";

        System.out.println(">>> MQTT Publish: " + topic + " | " + jsonPayload);
        mqttPublisher.sendToMqtt(jsonPayload, topic);
    }

    /**
     * 유저 차량 호출 API
     * POST /service-request/{workInfoId}/call
     * 
     * @param workInfoId 작업 정보 ID
     * @return 성공 여부
     */
    @PostMapping("/{workInfoId}/call")
    public ResponseEntity<?> callVehicle(@PathVariable Long workInfoId) {
        try {
            // WorkInfoEntity 조회
            Optional<WorkInfoEntity> optionalWorkInfo = serviceRequestDAO.findById(workInfoId);
            if (optionalWorkInfo.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "작업 정보를 찾을 수 없습니다."));
            }

            WorkInfoEntity workInfo = optionalWorkInfo.get();

            // 주차 상태 확인 (sectorId가 null이 아니어야 함)
            if (workInfo.getSectorId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "주차 중인 차량이 아닙니다."));
            }

            // carState 확인 (현재 위치)
            if (workInfo.getCarState() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "차량 위치 정보가 없습니다."));
            }

            // 주차 구역에 있는지 확인 (nodeName이 "주차_"로 시작해야 함)
            String nodeName = workInfo.getCarState().getNodeName();
            if (nodeName == null || !nodeName.startsWith("주차_")) {
                return ResponseEntity.badRequest().body(Map.of("error", "주차 구역에 있는 차량만 호출할 수 있습니다. 현재 위치: " + (nodeName != null ? nodeName : "알 수 없음")));
            }

            int currentNodeId = workInfo.getCarState().getNodeId();

            // 차량 번호 추출
            String carNumber = null;
            if (workInfo.getUserCar() != null && workInfo.getUserCar().getCar() != null) {
                carNumber = workInfo.getUserCar().getCar().getCarNumber();
            }

            if (carNumber == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "차량 번호를 찾을 수 없습니다."));
            }

            // 출구 경로 계산
            List<Integer> exitRoute = routeService.calculateExitRoute(currentNodeId);

            // MQTT 발행: rccar/{carNumber}/call
            String carId = carNumber.replaceAll("\\s+", "");
            String topic = "rccar/" + carId + "/call";
            
            Map<String, Object> payload = new HashMap<>();
            payload.put("action", "call");
            payload.put("route", exitRoute);

            String jsonPayload = objectMapper.writeValueAsString(payload);
            mqttPublisher.sendToMqtt(jsonPayload, topic);

            System.out.println(">>> 차량 호출 신호 발행: " + topic + " | " + jsonPayload);

            return ResponseEntity.ok(Map.of("message", "차량 호출 신호가 발행되었습니다.", "route", exitRoute));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

