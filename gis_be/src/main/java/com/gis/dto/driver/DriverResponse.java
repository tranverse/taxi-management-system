package com.gis.dto.driver;

import com.gis.dto.detail_review.DetailReviewResponse;
import com.gis.enums.DriverStatus;
import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
import com.gis.model.Car;
import com.gis.model.DetailReview;
import com.gis.model.VehicleType;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DriverResponse {
    String id;
    String name;
    String phone;
    String email;
    String username;
    Boolean gender;
    String avatar;
    Double star;
    LocalDateTime time;
    Double latitude;
    Double longitude;
    String driverLicense;
    DriverStatus driverStatus;
    UserStatus status;
    ERole role;
    Car car;
    VehicleType vehicleType;
    List<DetailReviewResponse> detailReview;
}
