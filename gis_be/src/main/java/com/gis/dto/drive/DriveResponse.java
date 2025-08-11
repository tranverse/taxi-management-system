package com.gis.dto.drive;

import com.gis.model.Car;
import com.gis.model.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DriveResponse {
    User user;
    Car car;
}
