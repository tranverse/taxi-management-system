package com.gis.dto.status;

import com.gis.enums.BookingStatus;
import com.gis.model.Booking;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatusResponse {
    String id;
    LocalDateTime time;
    Double latitude;
    Double longitude;
    BookingStatus bookingStatus;
    Booking booking;
}
