// 작업 테이블

package com.iot2ndproject.mobilityhub.domain.work.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import com.iot2ndproject.mobilityhub.domain.image.entity.ImageEntity;
import com.iot2ndproject.mobilityhub.domain.parking.entity.ParkingEntity;
import com.iot2ndproject.mobilityhub.domain.parkingmap.entity.ParkingMapNodeEntity;
import com.iot2ndproject.mobilityhub.domain.vehicle.entity.UserCarEntity;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 자동생성용 ID, 추후에 삭제해도 됌

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_car_id")
    private UserCarEntity userCar; // 유저-차 ID

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime requestTime; // 사용자 요청시간

    @ManyToOne
    @JoinColumn(name = "work_id")
    private WorkEntity work; // 작업 ID

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "sector_id")
    private ParkingEntity sectorId; // 차 위치

    // car_state 숫자(FK) -> parking_map_node.node_id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_state", referencedColumnName = "node_id")
    private ParkingMapNodeEntity carState;

    @Column(columnDefinition = "TEXT")
    private String additionalRequest; // 추가요청(주로 정비)

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime entryTime; // 입차시간

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime exitTime; // 출차시간

    // 이미지ID 연관관계해서 추가하기
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private ImageEntity image;

    // 사용자 요청 받았을 때
    public WorkInfoEntity(UserCarEntity car, WorkEntity work){
        this.userCar = car;
        this.work = work;
    }

    // 입구게이트에서 인식되었을 때
    // 출구게이트에서 인식되었을 때
    // => setter를 이용해서 작업하면 되므로 생성자 필요없을듯?

}
