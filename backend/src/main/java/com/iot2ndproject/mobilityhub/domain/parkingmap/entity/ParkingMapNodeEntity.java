package com.iot2ndproject.mobilityhub.domain.parkingmap.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "parking_map_node")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingMapNodeEntity {

    @Id
    @Column(name = "node_id")
    private Integer nodeId;

    @Column(name = "node_name")
    private String nodeName;
}
