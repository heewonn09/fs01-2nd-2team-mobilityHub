package com.iot2ndproject.mobilityhub.domain.user.controller;

import com.iot2ndproject.mobilityhub.domain.user.dto.*;
import com.iot2ndproject.mobilityhub.domain.user.dto.PasswordChangeDTO;
import com.iot2ndproject.mobilityhub.domain.user.jwt.TokenProvider;
import com.iot2ndproject.mobilityhub.domain.user.service.UserService;
import com.iot2ndproject.mobilityhub.domain.car.entity.CarEntity;
import com.iot2ndproject.mobilityhub.domain.car.entity.UserCarEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> profile(@RequestParam("userId") String userId){
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDTO profileDTO){
        userService.updateProfile(profileDTO);
        return ResponseEntity.ok(HttpStatus.OK);
    }


    // 유저 전체 목록 불러오기
    @GetMapping("/userlist")
    public List<UserListDTO> userlist(){
        return userService.getUserList();
    }

    // 비밀번호 변경 API
    @PutMapping("/password-change")
    public ResponseEntity<?> passwordChange(@RequestBody PasswordChangeDTO passwordChangeDTO) {
        boolean result = userService.changePassword(
            passwordChangeDTO.getUserId(),
            passwordChangeDTO.getCurrentPassword(),
            passwordChangeDTO.getNewPassword()
        );
        if (result) {
            return ResponseEntity.ok(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "현재 비밀번호가 일치하지 않습니다."));
        }
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

        httpHeaders.add("Authorization","Bearer "+jwtToken);
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