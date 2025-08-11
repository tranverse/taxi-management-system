package com.gis.repository;

import com.gis.model.Customer;
import com.gis.model.RefreshToken;
import com.gis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByUser(User user);
    Optional<RefreshToken> findByUserId(String id);

    Optional<RefreshToken> findByCustomer(Customer customer);
    Optional<RefreshToken> findByCustomerId(String id);
}
