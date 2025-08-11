package com.gis.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Price implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freight_rate_id", nullable = false)
    @JsonBackReference
    private FreightRate freightRate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    @JsonBackReference("vehicleType-price")
    private VehicleType vehicleType;

    public Price(LocalDateTime time, Double price, FreightRate freightRate, VehicleType vehicleType) {
        this.time = time;
        this.price = price;
        this.freightRate = freightRate;
        this.vehicleType = vehicleType;
    }
}

