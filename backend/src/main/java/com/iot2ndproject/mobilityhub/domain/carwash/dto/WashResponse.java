package com.iot2ndproject.mobilityhub.domain.carwash.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WashResponse {
    private Long id;   // work_info PK
    private Long carStateNodeId;  // nodeId만
    private String carStateName;  // 세차장에 도착했을 때 car_state: washIn
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Long carId;  // 세차장 차량번호
    private LocalDateTime requestTime;  // 서비스 요청시간
    private int workId;    // 작업 장소 아이디
    private String carNumber;   // CarEntity의 차량 번호 가져오기


}

