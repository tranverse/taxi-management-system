package com.gis.dto.car;

import com.gis.model.VehicleType;
import lombok.Data;

@Data
public class CarResponse {
    String id;
    String licensePlate;
    String image;
    String description;
    VehicleType vehicleType;
}
