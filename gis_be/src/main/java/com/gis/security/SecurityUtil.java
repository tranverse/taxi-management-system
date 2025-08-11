package com.gis.security;

import com.gis.exception.AppException;
import com.gis.model.Customer;
import com.gis.model.User;
import com.gis.repository.CustomerRepository;
import com.gis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {
    final private UserRepository userRepository;
    final private CustomerRepository customerRepository;

    public String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public User getCurrentUser() {
        return userRepository
                .findById(this.getCurrentUserId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found", "user-e-01"));
    }

    public Customer getCurrentCustomer() {
        return customerRepository
                .findById(this.getCurrentUserId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Customer not found", "customer-e-01"));
    }
}

