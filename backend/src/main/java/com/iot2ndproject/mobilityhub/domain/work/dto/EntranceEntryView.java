package com.iot2ndproject.mobilityhub.domain.work.dto;

import java.time.LocalDateTime;

public interface EntranceEntryView {

    Long getId();

    LocalDateTime getEntryTime();

    LocalDateTime getExitTime();   // 🔥 이 줄 추가

    // 연관 엔티티 접근
    String getUserCar_Car_CarNumber();

    String getImage_ImagePath();

    String getImage_CameraId();
}
