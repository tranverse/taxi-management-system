package com.gis.dto.booking;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gis.model.Customer;
import com.gis.model.Status;
import com.gis.model.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BookingResponse {
    String id;
    Double kilometer;
    Double startingX;
    Double startingY;
    Double destinationX;
    Double destinationY;
    Double driverX;
    Double driverY;
    LocalDateTime bookingTime;
    LocalDateTime finishTime;
    Double accumulatedDiscount;
    Double memberDiscount;
    Double price;
    Customer customer;
    User user;
    Status status;
}
