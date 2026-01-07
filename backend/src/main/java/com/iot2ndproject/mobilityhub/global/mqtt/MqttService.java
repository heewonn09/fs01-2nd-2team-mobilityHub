package com.iot2ndproject.mobilityhub.global.mqtt;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot2ndproject.mobilityhub.domain.entrance.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.entrance.repository.ImageRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.ParkingMapNodeEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.ParkingMapNodeRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.service_request.repository.WorkInfoRepository;
import com.iot2ndproject.mobilityhub.domain.service_request.service.ServiceRequestService;

import lombok.RequiredArgsConstructor;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MqttService {
    
    private static final int CARWASH_NODE_ID = 10;
    private final WorkInfoRepository workInfoRepository;
    private final ParkingMapNodeRepository parkingMapNodeRepository;
    private final MyPublisher mqttPublisher;
    private final ObjectMapper objectMapper;
    private final ImageRepository imageRepository;
    private final ServiceRequestService serviceRequestService;

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<String> message) {
        String payload = message.getPayload();
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);
//        System.out.println("Received Message: " + payload);
//        System.out.println("Received Topic: " + topic);

        if (topic == null) {
            return;
        }

        // 입구 이미지 토픽 처리
        if ("parking/web/entrance/image".equals(topic)) {
            handleEntranceImage(payload);
            return;
        }

        // 입구 캡처 토픽 처리
        if ("parking/web/entrance/capture".equals(topic)) {
            System.out.println(topic);
            System.out.println(payload);
            return;
        }

        // 세차 완료 신호 처리
        if ("parking/web/carwash".equals(topic)) {
            handleCarwashSignal(payload);
            return;
        }

        // RC카 위치 신호 처리 (rccar/+/position)
        if (topic.startsWith("rccar/") && topic.endsWith("/position")) {
            handleRcCarPosition(topic, payload);
            return;
        }

    }

    /**
     * RC카 위치 신호 처리
     * topic: MQTT 토픽 (예: rccar/{carId}/position)
     * payload: JSON 페이로드 (예: {"nodeId": 1, "nodeName": "입구", "timestamp": "2025-12-14 10:30:00"})
     */
    @Transactional
    private void handleRcCarPosition(String topic, String payload) {
        try {
            // 토픽에서 carId 추출 (rccar/{carId}/position)
            String[] topicParts = topic.split("/");
            if (topicParts.length < 3) {
                System.err.println("잘못된 토픽 형식: " + topic);
                return;
            }
            String carId = topicParts[1];
            
            // JSON 파싱
            Map<String, Object> positionData = objectMapper.readValue(
                    payload, 
                    new TypeReference<Map<String, Object>>() {}
            );
            Object nodeIdObj = positionData.get("nodeId");
            Integer nodeId = null;
            if (nodeIdObj instanceof Number) {
                nodeId = ((Number) nodeIdObj).intValue();
            }
            String nodeName = (String) positionData.get("nodeName");
            
            System.out.println(">>> RC카 위치 신호 수신: carId=" + carId + ", nodeId=" + nodeId + ", nodeName=" + nodeName);
            
            // carNumber(=topic의 carId)로 진행 중인 최신 작업 정보 조회 (work_id가 null이 아닌 것만)
            Optional<WorkInfoEntity> optionalWorkInfo =
                    workInfoRepository.findTopByUserCar_Car_CarNumberAndWorkIsNotNullOrderByRequestTimeDesc(carId);

            if (optionalWorkInfo.isEmpty()) {
                System.err.println("작업 정보를 찾을 수 없습니다: carNumber=" + carId);
                return;
            }

            WorkInfoEntity workInfo = optionalWorkInfo.get();

            // nodeId가 null이면(예: '건물 밖') DB의 car_state를 NULL로 저장
            if (nodeId == null) {
                workInfo.setCarState(null);
                workInfoRepository.save(workInfo);
                System.out.println(">>> WorkInfoEntity.carState 업데이트 완료: id=" + workInfo.getId() + ", nodeId=null (nodeName=" + nodeName + ")");
                return;
            }

            // 노드 ID로 ParkingMapNodeEntity 조회
            Optional<ParkingMapNodeEntity> optionalNode = parkingMapNodeRepository.findById(nodeId);
            if (optionalNode.isEmpty()) {
                System.err.println("노드를 찾을 수 없습니다: id=" + nodeId);
                return;
            }

            ParkingMapNodeEntity node = optionalNode.get();

            // carState 업데이트
            workInfo.setCarState(node);
            // 노드가 입구/출구일 경우 entrytime/exittime도 업데이트
            if (node.getNodeId() == 1) {
                if (workInfo.getEntryTime() == null) {
                    workInfo.setEntryTime(LocalDateTime.now());
                }
            } else if (node.getNodeId() == 20) {
                if (workInfo.getExitTime() == null) {
                    workInfo.setExitTime(LocalDateTime.now());
                }
            }
            workInfoRepository.save(workInfo);

            System.out.println(">>> WorkInfoEntity.carState 업데이트 완료: id=" + workInfo.getId() + ", nodeId=" + nodeId);

            // 구역별 라즈베리파이에 신호 발행
            publishZoneSignal(node, carId);
            
        } catch (Exception e) {
            System.err.println("RC카 위치 신호 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }


    /**
     * 구역별 라즈베리파이에 MQTT 신호 발행
     * nodeName을 기반으로 구역을 판단하여 신호 발행
     * param: node ParkingMapNodeEntity
     * carId: 차량 ID (carNumber)
     */
    private void publishZoneSignal(ParkingMapNodeEntity node, String carId) {
        try {
            if (node == null || node.getNodeName() == null) {
                return;
            }
            
            String nodeName = node.getNodeName();
            String topic = null;
            String zoneName = null;
            
            // nodeName을 기반으로 구역 판단
            if ("입구".equals(nodeName)) {
                topic = "parking/web/entrance";
                zoneName = "입구 게이트";
            } else if (nodeName.startsWith("세차_")) {
                topic = "parking/web/carwash";
                zoneName = "세차장";
            } else if (nodeName.startsWith("정비_")) {
                topic = "parking/web/repair";
                zoneName = "정비소";
            } else if (nodeName.startsWith("주차_")) {
                topic = "parking/web/park";
                zoneName = "주차장";
            }
            
            if (topic != null) {
                String message = "comeIn";
                mqttPublisher.sendToMqtt(message, topic);
                System.out.println(">>> " + zoneName + " 라즈베리파이에 신호 발행: " + topic + " | " + message + " (nodeName: " + nodeName + ")");
            }
        } catch (Exception e) {
            System.err.println("구역별 라즈베리파이 신호 발행 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleCarwashSignal(String payload) {
        if (payload == null) {
            return;
        }
        String normalized = payload.trim().toLowerCase();
        if (!"end".equals(normalized)) {
            return;
        }

        Optional<WorkInfoEntity> optionalWorkInfo =
                workInfoRepository.findTopByCarState_NodeIdAndWorkIsNotNullOrderByRequestTimeDesc(CARWASH_NODE_ID);

        if (optionalWorkInfo.isEmpty()) {
            System.err.println("세차 완료 신호를 수신했지만 세차 대기 중인 작업을 찾을 수 없습니다.");
            return;
        }

        WorkInfoEntity workInfo = optionalWorkInfo.get();
        String workType = (workInfo.getWork() != null) ? workInfo.getWork().getWorkType() : null;
        if (workType == null || !workType.trim().toLowerCase().contains("carwash")) {
            System.err.println("세차 완료 신호를 수신했지만 work_type이 세차가 아닙니다: " + workType);
            return;
        }

        try {
            int workInfoId = Math.toIntExact(workInfo.getId());
            serviceRequestService.completeService(workInfoId, "carwash");
            System.out.println(">>> 세차 완료 신호 처리: workInfoId=" + workInfoId + " -> RC카 이동 명령 발행");
        } catch (Exception e) {
            System.err.println("세차 완료 신호 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
    @Transactional
    private void handleEntranceImage(String payload) {
        try {
            Map<String, Object> data = objectMapper.readValue(
                    payload, new TypeReference<Map<String, Object>>() {}
            );

            String cameraId = (String) data.get("cameraId");
            String imagePath = (String) data.get("imagePath");
            String ocrNumber = (String) data.get("ocrNumber");

            ImageEntity image = new ImageEntity();
            image.setCameraId(cameraId);
            image.setImagePath(imagePath);
            image.setOcrNumber(ocrNumber);

            imageRepository.save(image);

            System.out.println(" image 테이블 저장 완료");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
