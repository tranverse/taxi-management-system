package com.gis.service;

import com.gis.dto.status.StatusResponse;
import com.gis.dto.status.StatusTraceRequest;
import com.gis.dto.status.StatusUpdateRequest;
import com.gis.enums.BookingStatus;
import com.gis.enums.DriverStatus;
import com.gis.exception.AppException;
import com.gis.mapper.StatusMapper;
import com.gis.model.*;
import com.gis.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatusService {
    private final StatusRepository statusRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final TypeRepository typeRepository;
    private final StatusMapper statusMapper;
    private final SimpMessagingTemplate messagingTemplate;


    public StatusResponse updateStatus(StatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(request.getBooking().getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Booking not found", "booking-e-02"));
        Customer customer = customerRepository.findById(booking.getCustomer().getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Customer not found", "customer-e-02"));
        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found", "user-e-02"));
        Map<BookingStatus, BookingStatus> nextStatusMap = Map.of(
                BookingStatus.SUCCESS, BookingStatus.PICKING,
                BookingStatus.PICKING, BookingStatus.TRANSPORTING,
                BookingStatus.TRANSPORTING, BookingStatus.FINISH
        );
        BookingStatus lastStatus = statusRepository.findTopByBookingOrderByTimeDesc(booking)
                .map(Status::getBookingStatus)
                .orElse(BookingStatus.PICKING);
        BookingStatus currentStatus = nextStatusMap.getOrDefault(lastStatus, lastStatus);
        Status status = Status.builder()
                .time(LocalDateTime.now())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .booking(booking)
                .bookingStatus(currentStatus)
                .build();
        statusRepository.save(status);
        if(lastStatus == BookingStatus.SUCCESS && currentStatus == BookingStatus.PICKING) {
            user.setDriverStatus(DriverStatus.BUSY);
            userRepository.save(user);
            messagingTemplate.convertAndSendToUser(user.getId() ,"/confirm-picking", statusMapper.toStatusResponse(status));
        }
        if(lastStatus == BookingStatus.PICKING && currentStatus == BookingStatus.TRANSPORTING) {
            user.setDriverStatus(DriverStatus.BUSY);
            userRepository.save(user);
            messagingTemplate.convertAndSendToUser(user.getId() ,"/confirm-transporting", statusMapper.toStatusResponse(status));
        }
        if (lastStatus == BookingStatus.TRANSPORTING && currentStatus == BookingStatus.FINISH) {
            long pointsEarned = (long) (booking.getPrice() / 100);
            if (booking.getAccumulatedDiscount() != 0.0){
                customer.setAccumulate(pointsEarned);
            }else{
                customer.setAccumulate(customer.getAccumulate() + pointsEarned);
            }
            customer.setTotal(customer.getTotal() + pointsEarned);

            updateCustomerType(customer);

            customerRepository.save(customer);

            booking.setFinishTime(LocalDateTime.now());
            bookingRepository.save(booking);

            user.setDriverStatus(DriverStatus.FREE);
            user.setLatitude(booking.getDestinationY());
            user.setLongitude(booking.getDestinationX());
            userRepository.save(user);
            messagingTemplate.convertAndSendToUser(user.getId() ,"/review-status", statusMapper.toStatusResponse(status));
        }
        return statusMapper.toStatusResponse(status);
    }

    private void updateCustomerType(Customer customer) {
        List<Type> types = typeRepository.findAll();
        types.sort(Comparator.comparingLong(Type::getPoint));
        Type newType = null;
        for (Type type : types) {
            if (customer.getTotal() >= type.getPoint()) {
                newType = type;
            } else {
                break;
            }
        }
        if (newType != null && !newType.getId().equals(customer.getType().getId())) {
            customer.setType(newType);
        }
    }


    public StatusResponse trace(StatusTraceRequest request) {
        Booking booking = bookingRepository.findById(request.getBooking().getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Booking not found", "booking-e-02"));
        Status status = Status.builder()
                .time(LocalDateTime.now())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .booking(booking)
                .bookingStatus(request.getStatus())
                .build();
        statusRepository.save(status);
        return statusMapper.toStatusResponse(status);
    }
}
