package com.gis.repository;

import com.gis.model.FreightRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FreightRateRepository extends JpaRepository<FreightRate, String> {
    FreightRate findByUpperAndLower(Integer upper, Integer lower);
}
