package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.booking.BookingDetailResponse;
import com.gis.dto.booking.BookingRequest;
import com.gis.dto.booking.BookingResponse;
import com.gis.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor

public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/booking")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<BookingResponse>> booking(@Valid @RequestBody BookingRequest request) {
        ApiResponse<BookingResponse> apiResponse = ApiResponse.<BookingResponse>builder()
                .code("booking-s-01")
                .data(bookingService.booking(request))
                .message("Đặt xe thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/rejected-booking/{bookingId}")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<BookingResponse>> rejectedBooking(@PathVariable("bookingId") String bookingId) {
        ApiResponse<BookingResponse> apiResponse = ApiResponse.<BookingResponse>builder()
                .code("booking-s-01")
                .data(bookingService.rejectBooking(bookingId))
                .message("Từ chối chuyến xe thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/detail/{bookingId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<BookingDetailResponse>> getBooking(@PathVariable("bookingId") String bookingId) {
        ApiResponse<BookingDetailResponse> apiResponse = ApiResponse.<BookingDetailResponse>builder()
                .code("booking-s-02")
                .data(bookingService.getBooking(bookingId))
                .message("Lấy thông tin chuyến xe thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/status/{bookingId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<BookingResponse>> getStatusBooking(@PathVariable("bookingId") String bookingId) {
        ApiResponse<BookingResponse> apiResponse = ApiResponse.<BookingResponse>builder()
                .code("booking-s-02")
                .data(bookingService.getStatusBooking(bookingId))
                .message("Lấy thông tin chuyến xe thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/all-customer/{customerId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<BookingDetailResponse>>> getAllBookingByCustomer(@PathVariable("customerId") String customerId){
        ApiResponse<List<BookingDetailResponse>> apiResponse = ApiResponse.<List<BookingDetailResponse>>builder()
                .code("booking-s-10")
                .message("Lấy danh sách chuyến xe của khách hàng thành công")
                .data(bookingService.getAllBookingByCustomer(customerId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/all-user/{userId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<BookingDetailResponse>>> getAllBookingByUser(@PathVariable("userId") String userId){
        ApiResponse<List<BookingDetailResponse>> apiResponse = ApiResponse.<List<BookingDetailResponse>>builder()
                .code("booking-s-10")
                .message("Lấy danh sách chuyến xe của tài xế thành công")
                .data(bookingService.getAllBookingByUser(userId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/detail-driver/{driverId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<BookingDetailResponse>> getBookingByDriverId(@PathVariable("driverId") String driverId){
        ApiResponse<BookingDetailResponse> apiResponse = ApiResponse.<BookingDetailResponse>builder()
                .code("booking-s-10")
                .message("Lấy danh sách chuyến xe của tài xế thành công")
                .data(bookingService.getBookingByDriverId(driverId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
