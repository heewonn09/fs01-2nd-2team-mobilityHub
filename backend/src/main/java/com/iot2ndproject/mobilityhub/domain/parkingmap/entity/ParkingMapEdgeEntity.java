package com.iot2ndproject.mobilityhub.domain.parkingmap.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(
        name = "parking_map_edge",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_parking_map_edge_from_to_dir",
                        columnNames = {"from_node_id", "to_node_id", "direction"}
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingMapEdgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "edge_id")
    private Long edgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_node_id", nullable = false)
    @ToString.Exclude
    private ParkingMapNodeEntity fromNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_node_id", nullable = false)
    @ToString.Exclude
    private ParkingMapNodeEntity toNode;

    @Column(name = "direction", nullable = false)
    private String direction;
}
