package com.gis.repository;

import com.gis.model.Price;
import com.gis.model.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceRepository extends JpaRepository<Price, String> {
    List<Price> findByVehicleType(VehicleType vehicleType);
}
