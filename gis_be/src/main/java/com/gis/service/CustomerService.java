package com.gis.service;

import com.gis.dto.customer.CustomerResponse;
import com.gis.exception.AppException;
import com.gis.model.Customer;
import com.gis.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;

}
