package com.gis.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class VehicleType implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer seat;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "vehicleType")
    @JsonManagedReference("vehicleType-price")
    private List<Price> price = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "vehicleType")
    @JsonManagedReference("vehicleType-car")
    private List<Car> cars = new ArrayList<>();

    public VehicleType(String model, Integer seat) {
        this.model = model;
        this.seat = seat;
    }

}
