package com.gis.dto.review;

import com.gis.dto.booking.BookingDetailResponse;
import com.gis.dto.booking.BookingResponse;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewDetailResponse {
    BookingDetailResponse booking;
    List<ReviewResponse.CriteriaResponse> criteriaList; // Sử dụng class mới
    String text;

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CriteriaResponse {
        String criteriaId;
        String name; // Lấy từ Criteria trong DB
        Integer star;
    }
}
