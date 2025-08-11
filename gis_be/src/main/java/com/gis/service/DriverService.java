package com.gis.service;

import com.gis.dto.driver.DriverRegisterRequest;
import com.gis.dto.driver.DriverResponse;
import com.gis.dto.driver.DriverUpdateLocationRequest;
import com.gis.enums.DriverStatus;
import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
import com.gis.exception.AppException;
import com.gis.mapper.UserMapper;
import com.gis.model.User;
import com.gis.repository.UserRepository;
import com.gis.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {
    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;
    private final UserMapper userMapper;

    public DriverResponse registerDriver(DriverRegisterRequest request){
        boolean existedDriver = userRepository.existsByEmail(request.getEmail());
        if (existedDriver) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Email has existed", "auth-e-01");
        }
        String password = request.getPassword();
        String hashedPassword = passwordUtil.encodePassword(password);
        User user = User.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .driverLicense(request.getDriverLicense())
                .driverStatus(DriverStatus.INACTIVE)
                .gender(request.getGender())
                .role(ERole.DRIVER)
                .status(UserStatus.ACTIVE)
                .username(request.getUsername())
                .star(0.0)
                .password(hashedPassword)
                .build();
        userRepository.save(user);
        return userMapper.toDriverResponse(user);
    }

    public List<DriverResponse> getAllDriversFree(){
        List<User> users = userRepository.findByRoleAndDriverStatus(ERole.DRIVER, DriverStatus.FREE);
        return userMapper.toDriverResponseList(users);
    }

    public List<DriverResponse> getAllDriversFreeAndVehicleType(String vehicleTypeId){
        List<User> users = userRepository.findUsersByVehicleTypeIdAndDriverStatusAndRole(vehicleTypeId, DriverStatus.FREE, ERole.DRIVER);
        return userMapper.toDriverResponseList(users);
    }

    public List<DriverResponse> getAllDriversBusy(){
        List<User> users = userRepository.findByRoleAndDriverStatus(ERole.DRIVER, DriverStatus.BUSY);
        return userMapper.toDriverResponseList(users);
    }
    public List<DriverResponse> getAllDriversOff(){
        List<User> users = userRepository.findByRoleAndDriverStatus(ERole.DRIVER, DriverStatus.OFF);
        return userMapper.toDriverResponseList(users);
    }
    public List<DriverResponse> getAllDriversInactive(){
        List<User> users = userRepository.findByRoleAndDriverStatus(ERole.DRIVER, DriverStatus.INACTIVE);
        return userMapper.toDriverResponseList(users);
    }
    public List<DriverResponse> getAllDriversNotOffAndInactive(){
        List<User> users = userRepository.findByDriverStatusNotIn(Arrays.asList(DriverStatus.OFF, DriverStatus.INACTIVE));
        return userMapper.toDriverResponseList(users);
    }

    public DriverResponse updateLocation(String driverId, DriverUpdateLocationRequest request){
        User driver = userRepository.findById(driverId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Driver not found", "driver-e-02"));
        driver.setLatitude(request.getLatitude());
        driver.setLongitude(request.getLongitude());
        return userMapper.toDriverResponse(driver);
    }

    public DriverResponse getDriver(String driverId){
        User driver = userRepository.findById(driverId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Driver not found", "driver-e-02"));
        return userMapper.toDriverResponse(driver);
    }
}
