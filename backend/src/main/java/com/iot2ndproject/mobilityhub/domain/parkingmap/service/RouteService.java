package com.iot2ndproject.mobilityhub.domain.parkingmap.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * 서비스 타입(park/carwash/repair) 조합에 따라 노드 경로를 반환하는 서비스.
 * 현재는 하드코딩된 경로를 반환하며, 추후 parking_map_node/edge 기반으로 동적 계산 가능.
 */
@Service
public class RouteService {

    /**
     * 서비스 타입에 따른 노드 경로 반환
     * @param workType work.work_type (예: "park", "carwash", "park,carwash" 등)
     * @return 노드 ID 배열 (입구 1 → 서비스 구역 → 합류 → 출구 20)
     */
    public List<Integer> calculateRoute(String workType) {
        if (workType == null || workType.isBlank()) {
            throw new IllegalArgumentException("workType is required");
        }

        String normalized = workType.trim().toLowerCase();

        // work.work_type별 고정 경로 (data.sql 기준)
        switch (normalized) {
            case "park":
                // 입구 → 주차1 → 합류 → 출구
                return Arrays.asList(1, 2, 3, 4, 5, 23, 18, 19, 20);

            case "carwash":
                // 입구 → 세차 → 합류 → 출구
                return Arrays.asList(1, 2, 10, 15, 17, 18, 19, 20);

            case "repair":
                // 입구 → 정비 → 합류 → 출구
                return Arrays.asList(1, 2, 12, 13, 14, 17, 18, 19, 20);

            case "park,carwash":
                // 입구 → 세차 → 합류 → 주차1 → 합류 → 출구
                return Arrays.asList(1, 2, 10, 15, 17, 18, 3, 4, 5, 23, 18, 19, 20);

            case "park,repair":
                // 입구 → 정비 → 합류 → 주차1 → 합류 → 출구
                return Arrays.asList(1, 2, 12, 13, 14, 17, 18, 3, 4, 5, 23, 18, 19, 20);

            default:
                throw new IllegalArgumentException("Unknown workType: " + workType);
        }
    }

    /**
     * 주차 노드에서 출구까지의 경로 계산
     * @param currentNodeId 현재 노드 ID (주차 노드: 5, 7, 9 등)
     * @return 출구(20)까지의 노드 ID 배열
     */
    public List<Integer> calculateExitRoute(int currentNodeId) {
        // 주차 노드별 출구 경로
        switch (currentNodeId) {
            case 5: // 주차_1
                return Arrays.asList(5, 23, 18, 19, 20);
            case 7: // 주차_2
                return Arrays.asList(7, 22, 18, 19, 20);
            case 9: // 주차_3
                return Arrays.asList(9, 21, 18, 19, 20);
            default:
                throw new IllegalArgumentException("주차 구역이 아닌 노드에서는 호출할 수 없습니다. 현재 노드 ID: " + currentNodeId);
        }
    }
}
