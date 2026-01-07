// ParkingDTO.java
package com.iot2ndproject.mobilityhub.domain.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParkingDTO {
    private String sectorId;
    private String sectorName;
    private String carNumber;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private String state;
}
