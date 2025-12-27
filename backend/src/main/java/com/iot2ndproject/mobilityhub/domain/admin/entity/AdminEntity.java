// 관리자 테이블

package com.iot2ndproject.mobilityhub.domain.admin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminEntity {

    @Id
    private String adminId; // 관리자 아이디

    @Column(nullable = false)
    private String adminPass; // 관리자 패스워드

    @Column(nullable = false)
    private String adminName; // 관리자 이름

    @Column(nullable = false)
    private String email;     // 이메일

    @Column(nullable = false)
    private String phone;     // 전화번호

    @Column(nullable = false)
    private String role;      // role
}
