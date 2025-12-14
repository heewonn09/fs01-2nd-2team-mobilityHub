// 유저 테이블

package com.iot2ndproject.mobilityhub.domain.user.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.integration.annotation.Default;

import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    private String userId; // 유저아이디

    @Column(name = "user_password", nullable = false)
    private String password; // 패스워드

    @Column(nullable = false)
    private String userName; // 이름

    @Column(name = "phone_number", nullable = false)
    private String tel; // 휴대폰번호

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createDate; // 가입날짜

    @Column
    private String role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserCarEntity> userCars = new ArrayList<>();
    // 회원가입시
    public UserEntity(String userId, String password, String userName, String tel, String role) {
        this.userId = userId;
        this.password = password;
        this.userName = userName;
        this.tel = tel;
        this.role = role;
    }
}
