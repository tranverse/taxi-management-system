package com.gis.service;

import com.gis.dto.drive.DriveRequest;
import com.gis.dto.driver.DriverResponse;
import com.gis.dto.user.UserCreateAccountRequest;
import com.gis.dto.user.UserCreateAccountResponse;
import com.gis.enums.DriverStatus;
import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
import com.gis.exception.AppException;
import com.gis.mapper.UserMapper;
import com.gis.model.User;
import com.gis.repository.UserRepository;
import com.gis.util.PasswordUtil;
import com.gis.util.user.CreateUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;
    private final CreateUserUtil createUserUtil;
    private final UserMapper userMapper;
    private final DriveService driveService;

    public UserCreateAccountResponse createAccountUser(UserCreateAccountRequest request) {
        boolean existedUser = userRepository.existsByEmail(request.getEmail());
        if (existedUser) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Email has existed", "auth-e-01");
        }
        String username = createUserUtil.generateUsername(request.getName());
        String password = createUserUtil.generatePassword();
        String hashedPassword = passwordUtil.encodePassword(password);
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(request.getGender())
                .username(username)
                .password(hashedPassword)
                .role(ERole.USER)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(user);
        UserCreateAccountResponse response = userMapper.toUserCreateAccountResponse(user);
        response.setPassword(password);
        return response;
    }

    public void activeDriver(String driverId, DriveRequest request){
        User user = userRepository.findById(driverId).orElseThrow(()
                -> new AppException(HttpStatus.NOT_FOUND, "Driver not found", "auth-e-02"));
        driveService.drive(request);
        user.setDriverStatus(DriverStatus.OFF);
        userRepository.save(user);
    }
}
