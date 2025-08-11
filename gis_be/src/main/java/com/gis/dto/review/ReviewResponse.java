package com.gis.dto.review;

import com.gis.dto.booking.BookingResponse;
import com.gis.model.Booking;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    Booking booking;
    List<CriteriaResponse> criteriaList; // Sử dụng class mới
    String text;

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CriteriaResponse {
        String criteriaId;
        String name; // Lấy từ Criteria trong DB
        Integer star;
    }
}
