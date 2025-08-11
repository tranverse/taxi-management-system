package com.gis.dto.drive;

import com.gis.model.Car;
import com.gis.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DriveRequest {
    @NotNull(message = "Bạn chưa chọn tài xế")
    User user;

    @NotNull(message = "Bạn chưa chọn xe")
    Car car;
}
