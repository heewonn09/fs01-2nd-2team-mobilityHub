// 이미지 테이블

package com.iot2ndproject.mobilityhub.domain.image.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "image")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int imageId; // 이미지 ID <- 임시로 auto_increment

    @Column(nullable = false)
    private String cameraId; // 카메라센서 ID

    private String imagePath; // 이미지 경로

    @CreationTimestamp
    private LocalDateTime regDate; // 등록일시

    // 카메라에 번호판 촬영되었을 시 사용되는 생성자
    public ImageEntity(String cameraId, String imagePath) {
        this.cameraId = cameraId;
        this.imagePath = imagePath;
    }

}
