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

public class Type implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double reducedRate;

    @Column(nullable = false)
    private Long point;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "type", orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("customer-type")
    private List<Customer> customers = new ArrayList<>();

    public Type(String name, Double reducedRate, Long point) {
        this.name = name;
        this.reducedRate = reducedRate;
        this.point = point;
    }
}
