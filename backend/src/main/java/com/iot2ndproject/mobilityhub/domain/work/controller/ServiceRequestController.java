package com.iot2ndproject.mobilityhub.domain.work.controller;

import com.iot2ndproject.mobilityhub.domain.work.dto.ServiceRequestDTO;
import com.iot2ndproject.mobilityhub.domain.work.service.ServiceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/service-request")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    @PostMapping
    public ResponseEntity<?> createServiceRequest(@RequestBody ServiceRequestDTO dto) {
        try {
            ServiceRequestDTO created = serviceRequestService.create(dto);
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

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateServiceStatus(
            @PathVariable Long id,
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
}

