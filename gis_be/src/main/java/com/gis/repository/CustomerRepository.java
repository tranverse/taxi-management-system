package com.gis.repository;

import com.gis.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    boolean existsByEmailAndIsOutsideFalse(String email);
    Optional<Customer> findByEmailAndIsOutsideFalse(String email);
    Optional<Customer> findByIsOutsideTrueAndProviderNameAndProviderId(String providerName, String providerId);

    @Query("SELECT c.accumulate FROM Customer c WHERE c.id = :customerId")
    Long findAccumulateById(@Param("customerId") String customerId);
}
