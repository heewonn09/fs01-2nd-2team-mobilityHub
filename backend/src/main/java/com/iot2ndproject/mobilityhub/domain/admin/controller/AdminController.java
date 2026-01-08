package com.iot2ndproject.mobilityhub.domain.admin.controller;

import com.iot2ndproject.mobilityhub.domain.admin.dto.*;
import com.iot2ndproject.mobilityhub.domain.admin.service.AdminService;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserProfileDTO;
import com.iot2ndproject.mobilityhub.domain.user.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AuthenticationManagerBuilder managerBuilder;
    private final AdminService adminService;
    private final TokenProvider tokenProvider;

    //로그인 요청
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AdminLoginRequest loginRequest) {
        System.out.println(loginRequest);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginRequest.getAdminId(), loginRequest.getAdminPass());
        AuthenticationManager authenticationManager = managerBuilder.getObject();
        Authentication authentication = authenticationManager.authenticate(authenticationToken);
        AdminResponseDTO response = (AdminResponseDTO) authentication.getPrincipal();

        String jwtToken = "";
        if(response != null) {
            jwtToken = tokenProvider.createToken(authentication);
        }

        System.out.println("jwtToken: " + jwtToken);
        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.add("Authorization", "Bearer "+jwtToken);
        System.out.println(response);

        return ResponseEntity.ok()
                .headers(httpHeaders)
                .body(Map.of(
                        "accessToken", jwtToken,
                        "adminId", response.getAdminId(),
                        "roles", response.getRole(),
                        "email", response.getEmail()
                ));
    }

    // 관리자 전체조회
    @GetMapping("/list")
    public List<AdminResponseDTO> getAllAdmins() {
        return adminService.adminList();
    }

    // 관리자 정보 조회
    @GetMapping("/info")
    public AdminResponseDTO getMyInfo(@RequestParam(name = "adminId") String adminId) {
        return adminService.getAdminInfo(adminId);
    }

    // 관리자 정보 수정
    @PostMapping("/update")
    public AdminResponseDTO updateAdmin(@RequestParam(name = "adminId") String adminId, @RequestBody AdminUpdateRequest request) {
        return adminService.updateInfo(adminId, request);
    }

    // 비밀번호 변경
    @PostMapping("/password")
    public String changePassword( @RequestParam(name = "adminId") String adminId, @RequestBody AdminPassChangeRequest request) {
        adminService.changePassword(adminId, request);
        return "비밀번호가 변경되었습니다.";
    }
}
