package com.gis.dto.car;

import com.gis.model.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CarCreateRequest {
    @NotBlank(message = "Bạn chưa nhập biển số xe")
    String licensePlate;

    @NotNull(message = "Hình ảnh không thể trống")
    String image;

    @NotBlank(message = "Bạn chưa nhập mô tả")
    String description;

    @NotNull(message = "Bạn chưa cho loại xe")
    VehicleType vehicleType;
}
