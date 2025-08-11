package com.gis.repository;

import com.gis.model.Review;
import com.gis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, String> {
    Long countByBooking_User(User user);
}
