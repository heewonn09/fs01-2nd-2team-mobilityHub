package com.iot2ndproject.mobilityhub.domain.work.dto;


import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WashResponse {
    private Long id;   // work_info PK
    private String carState;  // 세차장에 도착했을 떼 car_state: washIn
    private Long carId;  // 세차장 차량번호
    private LocalDateTime requestTime;  // 서비스 요청시간
    private int workId;    // 작업 장소 아이디
    private String carNumber;   // CarEntity의 차량 번호 가져오기


}
