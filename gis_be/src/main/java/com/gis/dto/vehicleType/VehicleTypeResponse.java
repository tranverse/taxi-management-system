package com.gis.dto.vehicleType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class VehicleTypeResponse {
    String id;
    String model;
    Integer seat;
}
