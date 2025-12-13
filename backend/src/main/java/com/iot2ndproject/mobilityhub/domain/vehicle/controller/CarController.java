package com.iot2ndproject.mobilityhub.domain.vehicle.controller;


import com.iot2ndproject.mobilityhub.domain.vehicle.dto.UserCarRequestDTO;
import com.iot2ndproject.mobilityhub.domain.vehicle.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/car")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;

    @PostMapping("/save")
    public ResponseEntity<?> saveCar(@RequestBody UserCarRequestDTO userCarRequestDTO){
        System.out.println(userCarRequestDTO);
        carService.registerCar(userCarRequestDTO);
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/list")
    public ResponseEntity<?> listByUser(@RequestParam("userId") String userId){
        return ResponseEntity.ok(carService.findCarNumbersByUser(userId));
    }
}
