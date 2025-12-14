// 차정보 테이블

package com.iot2ndproject.mobilityhub.domain.vehicle.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "car")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarEntity {
    public CarEntity(String carNumber) {
        this.carNumber = carNumber;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId; // 차 ID

    @Column(nullable = false)
    private String carNumber; // 차번호

    @Column
    private String carModel;
    
    @CreationTimestamp
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime insertDate; // 차 등록날짜

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    private List<UserCarEntity> userCars = new ArrayList<>();
}
