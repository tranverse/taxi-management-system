package com.gis.repository;

import com.gis.model.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleTypeRepository extends JpaRepository<VehicleType, String> {
    VehicleType findByModel(String model);
}
