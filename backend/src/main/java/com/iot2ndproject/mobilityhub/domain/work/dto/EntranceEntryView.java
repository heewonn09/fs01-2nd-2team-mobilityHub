package com.iot2ndproject.mobilityhub.domain.work.dto;

import java.time.LocalDateTime;

public interface EntranceEntryView {

    Long getId();

    LocalDateTime getEntryTime();
    LocalDateTime getExitTime();

    String getUserCar_Car_CarNumber();

    String getImage_ImagePath();

    // ✅ 수정
    String getImage_CameraId();
}

