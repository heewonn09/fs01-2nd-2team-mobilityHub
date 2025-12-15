package com.iot2ndproject.mobilityhub.domain.repair.entity;

import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "repairReport")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportEntity {
    @Id
    @Column(length = 14)
    private String reportId;  // 보고서ID

    @ManyToOne
    @JoinColumn(name = "userCarId")
    private UserCarEntity userCar;  // user_car 테이블과 연관관계

    @ManyToOne
    @JoinColumn(name = "adminId")
    private AdminEntity admin;  // admin 테이블과 연관관계

    private String repairTitle;  // 정비 내용 타이틀

    @Column(columnDefinition = "TEXT")
    private String repairDetail;   // 정비 세부내용

    private int repairAmount;  //정비 청구금액

    // reportId를 년월일시분초로 자동 생성되게끔
    @PrePersist
    public void onPrePersist() {
        if (this.reportId == null) {
            this.reportId = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        }
    }
}
