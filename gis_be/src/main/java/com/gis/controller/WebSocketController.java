package com.gis.controller;

import com.gis.dto.booking.BookingRequest;
import com.gis.dto.booking.BookingResponse;
import com.gis.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final BookingService bookingService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/booking")
    public void handleBookingRequest(@Payload BookingRequest request) {
        System.out.println("Nhận JSON từ client: " + request);
        // Chỉ gọi service, không gửi thông báo nữa
        bookingService.booking(request);
    }
}