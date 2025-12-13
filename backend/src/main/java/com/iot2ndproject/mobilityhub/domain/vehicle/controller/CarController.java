package com.iot2ndproject.mobilityhub.domain.vehicle.controller;


import com.iot2ndproject.mobilityhub.domain.vehicle.dto.UserCarRequestDTO;
import com.iot2ndproject.mobilityhub.domain.vehicle.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/car")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;

    @PostMapping("/save")
    public ResponseEntity<?> saveCar(@RequestBody UserCarRequestDTO userCarRequestDTO){
        try {
            carService.registerCar(userCarRequestDTO);
            return ResponseEntity.ok("ok");
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                    "error", e.getMessage(),
                    "class", e.getClass().getSimpleName()
            ));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listByUser(@RequestParam("userId") String userId){
        return ResponseEntity.ok(carService.findCarNumbersByUser(userId));
    }
}
