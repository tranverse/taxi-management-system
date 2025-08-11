package com.gis.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Booking implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private Double kilometer;

    @Column(nullable = false)
    private Double startingX;

    @Column(nullable = false)
    private Double startingY;

    @Column(nullable = false)
    private Double destinationX;

    @Column(nullable = false)
    private Double destinationY;

    @Column(nullable = false)
    private Double driverX;

    @Column(nullable = false)
    private Double driverY;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    private LocalDateTime finishTime;

    @Column(nullable = false)
    private Double accumulatedDiscount;

    @Column(nullable = false)
    private Double memberDiscount;

    @Column(nullable = false)
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id",nullable = false)
    @JsonBackReference
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    @JsonBackReference("booking-user")
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "booking")
    @JsonManagedReference("review-booking")
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "booking")
    @JsonManagedReference("comment-booking")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "booking")
    @JsonManagedReference("booking-status")
    private List<Status> statuses = new ArrayList<>();
}
