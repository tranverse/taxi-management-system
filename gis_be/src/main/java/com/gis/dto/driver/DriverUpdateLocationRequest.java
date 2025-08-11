package com.gis.dto.driver;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DriverUpdateLocationRequest {
    Double latitude;
    Double longitude;
}
