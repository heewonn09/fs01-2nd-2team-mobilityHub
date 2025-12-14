package com.iot2ndproject.mobilityhub.domain.work.dto;

import java.time.LocalDateTime;

public interface EntranceEntryView {

    Long getId();

    LocalDateTime getEntryTime();
    LocalDateTime getExitTime();

    // user_car → car → car_number
    String getUserCar_Car_CarNumber();

    // image
    String getImage_ImagePath();
    Integer getImage_CameraId();
}
