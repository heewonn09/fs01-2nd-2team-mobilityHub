package com.iot2ndproject.mobilityhub.domain.user.controller;

import com.iot2ndproject.mobilityhub.domain.user.dto.LoginRequestDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserRequestDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserResponseDTO;
import com.iot2ndproject.mobilityhub.domain.user.jwt.TokenProvider;
import com.iot2ndproject.mobilityhub.domain.user.service.UserService;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final AuthenticationManagerBuilder managerBuilder;
    private final UserService userService;
    private final TokenProvider tokenProvider;

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UserRequestDTO requestDTO){
        userService.write(requestDTO);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody LoginRequestDTO loginRequestDTO){
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginRequestDTO.getUserId(),loginRequestDTO.getPassword());
        AuthenticationManager authenticationManager = managerBuilder.getObject();
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        UserResponseDTO responseDTO = (UserResponseDTO) authentication.getPrincipal();

        String jwtToken = "";
        if(responseDTO!=null){
            jwtToken =tokenProvider.createToken(authentication);
        }

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Athorization","Bearer "+jwtToken);
        System.out.println(responseDTO);
        return ResponseEntity.ok()
                .headers(httpHeaders)
                .body(Map.of(
                        "accessToken",jwtToken,
                        "userId",responseDTO.getUserId(),
                        "roles",responseDTO.getRole(),
                        "cars",responseDTO.getUserCars().stream()
                                .map(UserCarEntity::getCar)
                                .map(CarEntity::getCarNumber)
                                .collect(Collectors.joining(", "))
                ));
    }
}