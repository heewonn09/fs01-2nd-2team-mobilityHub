// 주차장 테이블

package com.iot2ndproject.mobilityhub.domain.parking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.repair.entity.StockStatusEntity;


@Entity
@Table(name = "parking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingEntity {
    @Id
    @Column(columnDefinition = "CHAR(3)")
    private String sectorId; // 섹터 ID

    @Column(nullable = false)
    private String sectorName; // 공간 이름

    private String state; // 빈공간 유무

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "admin_id")
    private AdminEntity admin; // 관리자ID(fk)

    @OneToMany(mappedBy = "sectorId")
    List<StockStatusEntity> stockStatus = new ArrayList<>();
}
