package com.iot2ndproject.mobilityhub.domain.carwash.controller;

import com.iot2ndproject.mobilityhub.domain.carwash.dto.WashResponse;
import com.iot2ndproject.mobilityhub.domain.carwash.service.CarWashService;
import com.iot2ndproject.mobilityhub.domain.service_request.service.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/carwash")
@RequiredArgsConstructor
public class CarWashController {
    private final CarWashService carWashService;
    private final ServiceRequestService serviceRequestService;


    // 세차장 목록 불러오기
    @GetMapping("/select")
    public List<WashResponse> washing(){
        return carWashService.findAll();
    }

    /**
     * 세차 작업 완료 처리
     * @param workInfoId 작업 정보 ID
     * @return 성공 여부
     */
    @PostMapping("/complete")
    public ResponseEntity<?> completeCarWash(@RequestParam int workInfoId) {
            serviceRequestService.completeService(workInfoId, "carwash");
            return ResponseEntity.ok(Map.of("message", "세차 끝"));
    }
}
