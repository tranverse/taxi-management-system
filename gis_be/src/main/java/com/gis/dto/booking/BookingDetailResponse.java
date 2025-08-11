package com.gis.dto.booking;

import com.gis.dto.review.ReviewResponse;
import com.gis.model.Customer;
import com.gis.model.Status;
import com.gis.model.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingDetailResponse {
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
    List<Status> statuses;
}
