package com.gis.mapper;

import com.gis.dto.booking.BookingDetailResponse;
import com.gis.dto.booking.BookingResponse;
import com.gis.model.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(source = "driverX", target = "driverX")
    @Mapping(source = "driverY", target = "driverY")
    @Mapping(target = "status", expression = "java(booking.getStatuses() != null && !booking.getStatuses().isEmpty() ? booking.getStatuses().get(0) : null)")
    BookingResponse toBookingResponse(Booking booking);

    List<BookingResponse> toBookingResponseList(List<Booking> booking);

    @Mapping(source = "driverX", target = "driverX")
    @Mapping(source = "driverY", target = "driverY")
    @Mapping(source = "statuses", target = "statuses")
    BookingDetailResponse toBookingDetailResponse(Booking booking);

    List<BookingDetailResponse> toBookingDetailResponseList(List<Booking> bookings);
}

