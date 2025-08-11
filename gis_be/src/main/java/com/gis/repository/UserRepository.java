package com.gis.repository;

import com.gis.enums.DriverStatus;
import com.gis.enums.ERole;
import com.gis.model.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    List<User> findByRoleAndDriverStatus(ERole role, DriverStatus driverStatus);
    List<User> findByDriverStatusNotIn(List<DriverStatus> status);


    @Query("""
        SELECT DISTINCT d.user 
        FROM Drive d 
        WHERE d.car.vehicleType.id = :vehicleTypeId 
        AND d.user.driverStatus = :driverStatus 
        AND d.user.role = :role
    """)
    List<User> findUsersByVehicleTypeIdAndDriverStatusAndRole(
            @Param("vehicleTypeId") String vehicleTypeId,
            @Param("driverStatus") DriverStatus driverStatus,
            @Param("role") ERole role
    );

}
