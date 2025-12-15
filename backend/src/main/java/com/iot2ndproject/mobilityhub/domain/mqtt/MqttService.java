package com.iot2ndproject.mobilityhub.domain.mqtt;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot2ndproject.mobilityhub.domain.parkingmap.entity.ParkingMapNodeEntity;
import com.iot2ndproject.mobilityhub.domain.parkingmap.repository.ParkingMapNodeRepository;
import com.iot2ndproject.mobilityhub.domain.work.entity.WorkInfoEntity;
import com.iot2ndproject.mobilityhub.domain.work.repository.WorkInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.Message;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MqttService {
    
    private final WorkInfoRepository workInfoRepository;
    private final ParkingMapNodeRepository parkingMapNodeRepository;
    private final MyPublisher mqttPublisher;
    private final ObjectMapper objectMapper;
    
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<String> message) {
        String payload = message.getPayload();
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);
        System.out.println("Received Message: " + payload);
        System.out.println("Received Topic: " + topic);

        // rccar/+/position 토픽 처리
        if (topic != null && topic.startsWith("rccar/") && topic.endsWith("/position")) {
            handleRcCarPosition(topic, payload);
        } else {
            // 기타 토픽 처리 (기존 로직)
            // TODO: 다른 토픽별 비즈니스 로직 처리
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
            int nodeId =(int) positionData.get("nodeId");
            String nodeName = (String) positionData.get("nodeName");
            
            System.out.println(">>> RC카 위치 신호 수신: carId=" + carId + ", nodeId=" + nodeId + ", nodeName=" + nodeName);
            
            // carNumber로 진행 중인 최신 작업 정보 조회 (work_id가 null이 아닌 것만)
            Optional<WorkInfoEntity> optionalWorkInfo = workInfoRepository
                    .findTopByUserCar_Car_CarNumberAndWorkIsNotNullOrderByRequestTimeDesc(carId);
            
            if (optionalWorkInfo.isEmpty()) {
                System.err.println("작업 정보를 찾을 수 없습니다: carNumber=" + carId + " (진행 중인 작업이 없습니다)");
                return;
            }
            
            WorkInfoEntity workInfo = optionalWorkInfo.get();
            
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
            if(node.getNodeId()==1){
                workInfo.setEntryTime(LocalDateTime.now());
            }else if(node.getNodeId() == 20){
                workInfo.setExitTime(LocalDateTime.now());
            }
            workInfoRepository.save(workInfo);

            System.out.println(">>> WorkInfoEnrity.carState 업데이트 완료:id=" + workInfo.getId() + ", nodeId=" + nodeId);
            
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
}