package com.gis.controller;
import com.gis.dto.ApiResponse;
import com.gis.dto.detail_review.DetailReviewResponse;
import com.gis.dto.review.ReviewDetailResponse;
import com.gis.dto.review.ReviewRequest;
import com.gis.dto.review.ReviewResponse;
import com.gis.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/review")
@RequiredArgsConstructor

public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody ReviewRequest request) {
        ApiResponse<ReviewResponse> apiResponse = ApiResponse.<ReviewResponse>builder()
                .code("review-s-01")
                .message("Thêm đánh giá thành công")
                .data(reviewService.createReview(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<DetailReviewResponse>>> getDetailReviewsByDriverId(@PathVariable String driverId) {
        List<DetailReviewResponse> detailReviews = reviewService.getDetailReviewsByDriverId(driverId);

        ApiResponse<List<DetailReviewResponse>> apiResponse = ApiResponse.<List<DetailReviewResponse>>builder()
                .code("review-s-02")
                .message("Lấy danh sách đánh giá thành công")
                .data(detailReviews)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/detail/{bookingId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('DRIVER') or hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewDetailResponse>> getReviewByBookingId(@PathVariable("bookingId") String bookingId) {
        ApiResponse<ReviewDetailResponse> apiResponse = ApiResponse.<ReviewDetailResponse>builder()
                .code("review-s-01")
                .message("Lấy đánh giá thành công")
                .data(reviewService.getReviewResponseByBookingId(bookingId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
