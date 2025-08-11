package com.gis.dto.status;

import com.gis.enums.BookingStatus;
import com.gis.model.Booking;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)

public class StatusTraceRequest {
    Double latitude;
    Double longitude;
    Booking booking;
    BookingStatus status;
}
