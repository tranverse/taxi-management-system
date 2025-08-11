package com.gis.dto.price;

import com.gis.model.VehicleType;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PriceRequest {
    Double kilometer;
    VehicleType vehicleType;
}
