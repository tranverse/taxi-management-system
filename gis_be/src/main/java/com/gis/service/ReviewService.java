package com.gis.service;

import com.gis.dto.detail_review.DetailReviewResponse;
import com.gis.dto.booking.BookingDetailResponse;
import com.gis.dto.booking.BookingResponse;
import com.gis.dto.review.ReviewDetailResponse;
import com.gis.dto.review.ReviewRequest;
import com.gis.dto.review.ReviewResponse;
import com.gis.exception.AppException;
import com.gis.model.*;
import com.gis.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final CriteriaRepository criteriaRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final DetailReviewRepository detailReviewRepository;

    public ReviewResponse createReview(ReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBooking().getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Booking not found", "booking-e-02"));
        Customer customer = booking.getCustomer();
        User user = booking.getUser();
        List<Review> reviews = new ArrayList<>();
        List<DetailReview> detailReviews = new ArrayList<>();

        Map<Criteria, Double> totalPointsMap = new HashMap<>();
        Map<Criteria, Long> countMap = new HashMap<>();

        List<ReviewResponse.CriteriaResponse> criteriaResponses = new ArrayList<>();

        for (ReviewRequest.ReviewCriteria criteriaData : request.getCriteriaList()) {
            Criteria criteria = criteriaRepository.findById(criteriaData.getCriteriaId())
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Criteria not found", "criteria-e-02"));
            Review review = new Review();
            review.setBooking(booking);
            review.setCriteria(criteria);
            review.setStar(criteriaData.getStar());
            reviews.add(review);

            DetailReview detailReview = new DetailReview();
            detailReview.setUser(user);
            detailReview.setCriteria(criteria);
            detailReview.setPoint((double) criteriaData.getStar());
            detailReviews.add(detailReview);

            totalPointsMap.put(criteria, detailReviewRepository.getTotalPoints(criteria.getId()) + criteriaData.getStar());
            countMap.put(criteria, detailReviewRepository.getReviewCount(criteria.getId()) + 1);

            ReviewResponse.CriteriaResponse criteriaResponse = new ReviewResponse.CriteriaResponse();
            criteriaResponse.setCriteriaId(criteriaData.getCriteriaId());
            criteriaResponse.setName(criteria.getName()); // Lấy name từ Criteria trong DB
            criteriaResponse.setStar(criteriaData.getStar());
            criteriaResponses.add(criteriaResponse);
        }

        reviewRepository.saveAll(reviews);

        updateUserStar(user, reviews);

        updateDetailReviewPoints(reviews);

        if (request.getText() != null && !request.getText().trim().isEmpty()) {
            Comment comment = Comment.builder()
                    .customer(customer)
                    .text(request.getText().trim()) // Loại bỏ khoảng trắng thừa
                    .booking(booking)
                    .build();
            commentRepository.save(comment);
        }

        ReviewResponse response = new ReviewResponse();
        response.setBooking(booking);
        response.setCriteriaList(criteriaResponses);
        response.setText(request.getText());
        return response;
    }

    private void updateUserStar(User user, List<Review> newReviews) {
        double oldStar = user.getStar();
        long reviewCount = reviewRepository.countByBooking_User(user);

        double totalStarsNewReviews = newReviews.stream().mapToDouble(Review::getStar).sum();
        long previousReviewCount = Math.max(reviewCount - newReviews.size(), 0);
        double newTotalStars = (oldStar * previousReviewCount) + totalStarsNewReviews;
        long newReviewCount = previousReviewCount + newReviews.size();

        double newAverageStar = (newReviewCount > 0) ? (newTotalStars / newReviewCount) : 0.0;
        user.setStar(newAverageStar);
        userRepository.save(user);
    }

    private void updateDetailReviewPoints(List<Review> reviews) {
        for (Review review : reviews) {
            Criteria criteria = review.getCriteria();
            User user = review.getBooking().getUser();

            List<DetailReview> existingDetailReviews = detailReviewRepository.findByCriteriaAndUser(criteria, user);

            if (!existingDetailReviews.isEmpty()) {
                DetailReview detailReview = existingDetailReviews.get(0); // Lấy bản ghi đầu tiên (nếu có)

                // Lấy tổng điểm đã có trong hệ thống
                double oldTotalPoints = detailReviewRepository.getTotalPoints(criteria.getId());

                // Lấy tổng số đánh giá đã có
                long oldReviewCount = detailReviewRepository.getReviewCount(criteria.getId());

                // Tính toán điểm trung bình mới
                double newTotalPoints = oldTotalPoints + review.getStar();
                long newTotalReviews = oldReviewCount + 1;
                double newAveragePoint = newTotalPoints / newTotalReviews;

                // Cập nhật điểm số mới
                detailReview.setPoint(newAveragePoint);
                detailReviewRepository.save(detailReview);
            } else {
                // Nếu chưa có bản ghi, tạo mới
                DetailReview detailReview = new DetailReview();
                detailReview.setUser(user);
                detailReview.setCriteria(criteria);
                detailReview.setPoint(Double.valueOf(review.getStar()));
                detailReviewRepository.save(detailReview);
            }
        }
    }
    public List<DetailReviewResponse> getDetailReviewsByDriverId(String driverId) {
        List<DetailReview> detailReviews = detailReviewRepository.findAllByUserId(driverId);
        return detailReviews.stream()
                .map(review -> new DetailReviewResponse(
                        review.getId(),
                        review.getPoint(),
                        review.getCriteria() // Lấy nguyên đối tượng Criteria
                ))
                .collect(Collectors.toList());
    }

    public ReviewDetailResponse getReviewResponseByBookingId(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Booking not found", "booking-e-02"));



        List<Review> reviews = booking.getReviews();
        if (reviews == null || reviews.isEmpty()) {
            return null; // Không có review
        }

        // Giả sử lấy review đầu tiên
        Review review = reviews.get(0);

        // Chuyển Booking sang BookingResponse
        BookingDetailResponse bookingResponse = new BookingDetailResponse();
        bookingResponse.setId(booking.getId());
        bookingResponse.setKilometer(booking.getKilometer());
        bookingResponse.setStartingX(booking.getStartingX());
        bookingResponse.setStartingY(booking.getStartingY());
        bookingResponse.setDestinationX(booking.getDestinationX());
        bookingResponse.setDestinationY(booking.getDestinationY());
        bookingResponse.setBookingTime(booking.getBookingTime());
        bookingResponse.setFinishTime(booking.getFinishTime());
        bookingResponse.setAccumulatedDiscount(booking.getAccumulatedDiscount());
        bookingResponse.setMemberDiscount(booking.getMemberDiscount());
        bookingResponse.setPrice(booking.getPrice());
        bookingResponse.setCustomer(booking.getCustomer());
        bookingResponse.setUser(booking.getUser());
        bookingResponse.setStatuses(booking.getStatuses());

        // Ánh xạ Review -> ReviewResponse
        ReviewDetailResponse reviewResponse = new ReviewDetailResponse();
        reviewResponse.setBooking(bookingResponse);

        String text = booking.getComments().isEmpty() ? null : booking.getComments().get(0).getText();
        reviewResponse.setText(text);

        // Ánh xạ Criteria từ Review
        // Duyệt tất cả reviews và ánh xạ criteria từ mỗi review
        List<ReviewResponse.CriteriaResponse> criteriaList = booking.getReviews().stream()
                .map(r -> {
                    ReviewResponse.CriteriaResponse criteriaResponse = new ReviewResponse.CriteriaResponse();
                    criteriaResponse.setCriteriaId(r.getCriteria().getId());
                    criteriaResponse.setName(r.getCriteria().getName());
                    criteriaResponse.setStar(r.getStar());
                    return criteriaResponse;
                })
                .collect(Collectors.toList());

        reviewResponse.setCriteriaList(criteriaList);


        return reviewResponse;
    }

}
