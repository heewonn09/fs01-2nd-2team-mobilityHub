package com.iot2ndproject.mobilityhub.domain.work.controller;

import com.iot2ndproject.mobilityhub.domain.work.dto.ServiceRequestDTO;
import com.iot2ndproject.mobilityhub.domain.work.service.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service-request")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    @PostMapping
    public ResponseEntity<ServiceRequestDTO> create(@RequestBody ServiceRequestDTO dto) {
        ServiceRequestDTO created = serviceRequestService.create(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequestDTO>> history(@RequestParam("userId") String userId) {
        List<ServiceRequestDTO> responses = serviceRequestService.getHistory(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/latest")
    public ResponseEntity<ServiceRequestDTO> latest(@RequestParam("userId") String userId) {
        return serviceRequestService.getLatest(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam("status") String status,
                                          @RequestParam(value = "service", required = false) String service) {
        boolean updated = serviceRequestService.updateStatus(id, status, service);
        if (!updated) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}

