package com.gis.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
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

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Customer implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private String phone;

    @Column(nullable = false)
    private String email;

    private String password;

    private String avatar;

    @Column(nullable = false)
    private Long accumulate;

    @Column(nullable = false)
    private Long total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ERole role = ERole.CUSTOMER;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    @JsonBackReference("customer-type")
    private Type type;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "customer")
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "customer")
    @JsonManagedReference
    private List<Booking> books = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true, mappedBy = "customer")
    @JsonManagedReference("comment-customer")
    private List<Comment> comments = new ArrayList<>();

    private String providerId;

    private String providerName;

    @Column(nullable = false)
    private Boolean isOutside = false;
}
