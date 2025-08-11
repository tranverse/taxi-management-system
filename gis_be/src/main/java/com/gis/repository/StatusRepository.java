package com.gis.repository;


import com.gis.enums.BookingStatus;
import com.gis.model.Booking;
import com.gis.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status, Long> {
    boolean existsByBookingAndBookingStatus(Booking booking, BookingStatus bookingStatus);
    Optional<Status> findTopByBookingOrderByTimeDesc(Booking booking);
}
