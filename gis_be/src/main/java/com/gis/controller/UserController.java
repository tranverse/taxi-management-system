package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.drive.DriveRequest;
import com.gis.dto.driver.DriverResponse;
import com.gis.dto.user.UserCreateAccountRequest;
import com.gis.dto.user.UserCreateAccountResponse;
import com.gis.service.DriveService;
import com.gis.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor

public class UserController {
    private final UserService userService;
    private final DriveService driveService;

    @PostMapping("/create-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserCreateAccountResponse>> createAccountUser(@Valid @RequestBody UserCreateAccountRequest request) {
        ApiResponse<UserCreateAccountResponse> apiResponse = ApiResponse.<UserCreateAccountResponse>builder()
                .code("user-s-01")
                .data(userService.createAccountUser(request))
                .message("Tạo tài khoản user thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/active-driver/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> activeDriver(@PathVariable("id") String driverId, @Valid @RequestBody DriveRequest request) {
        userService.activeDriver(driverId, request);
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("user-s-01")
                .message("Xác thực tài xế thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }


}
