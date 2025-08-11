package com.gis.dto.booking;

import com.gis.model.Customer;
import com.gis.model.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)

public class BookingRequest {
    Double kilometer;
    Double startingX;
    Double startingY;
    Double destinationX;
    Double destinationY;
    Double driverX;
    Double driverY;
    Double accumulatedDiscount;
    Double memberDiscount;
    Double price;
    Customer customer;
    User user;
}
