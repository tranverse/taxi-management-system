package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.driver.DriverRegisterRequest;
import com.gis.dto.driver.DriverResponse;
import com.gis.dto.driver.DriverUpdateLocationRequest;
import com.gis.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/driver")
@RequiredArgsConstructor

public class DriverController {
    private final DriverService driverService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<DriverResponse>> registerDriver(@Valid @RequestBody DriverRegisterRequest request) {
        ApiResponse<DriverResponse> apiResponse = ApiResponse.<DriverResponse>builder()
                .code("driver-s-01")
                .message("Đăng ký trở thành tài xế thành công")
                .data(driverService.registerDriver(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/all-driver-free")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDriversFree() {
        ApiResponse<List<DriverResponse>> apiResponse = ApiResponse.<List<DriverResponse>>builder()
                .code("driver-s-02")
                .message("Lấy danh sách tài xế hoạt động thành công")
                .data(driverService.getAllDriversFree())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/all-driver-free/{vehicleTypeId}")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDriversFreeAndVehicleType(@PathVariable("vehicleTypeId") String vehicleTypeId) {
        ApiResponse<List<DriverResponse>> apiResponse = ApiResponse.<List<DriverResponse>>builder()
                .code("driver-s-02")
                .message("Lấy danh sách tài xế theo loại xe hoạt động thành công")
                .data(driverService.getAllDriversFreeAndVehicleType(vehicleTypeId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/all-driver-busy")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDriversBusy() {
        ApiResponse<List<DriverResponse>> apiResponse = ApiResponse.<List<DriverResponse>>builder()
                .code("driver-s-02")
                .message("Lấy danh sách tài xế bận thành công")
                .data(driverService.getAllDriversBusy())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
    @GetMapping("/all-driver-inactive")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDriversInactive() {
        ApiResponse<List<DriverResponse>> apiResponse = ApiResponse.<List<DriverResponse>>builder()
                .code("driver-s-02")
                .message("Lấy danh sách tài xế chờ duyệt thành công")
                .data(driverService.getAllDriversInactive())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
    @GetMapping("/all-driver-off")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDriversOff() {
        ApiResponse<List<DriverResponse>> apiResponse = ApiResponse.<List<DriverResponse>>builder()
                .code("driver-s-02")
                .message("Lấy danh sách tài xế nghỉ thành công")
                .data(driverService.getAllDriversOff())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/all-driver-not-off-inactive")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> listDriversOffInactive() {
        ApiResponse<List<DriverResponse>> apiResponse = ApiResponse.<List<DriverResponse>>builder()
                .code("driver-s-03")
                .message("Lấy danh sách tài xế thành công")
                .data(driverService.getAllDriversNotOffAndInactive())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PutMapping("/update-location/{driverId}")
    public ResponseEntity<ApiResponse<DriverResponse>> updateLocation(@PathVariable("driverId") String driverId,
                                                                            @Valid @RequestBody DriverUpdateLocationRequest request) {
        ApiResponse<DriverResponse> apiResponse = ApiResponse.<DriverResponse>builder()
                .code("driver-s-04")
                .message("Cập nhật vị trí tài xế thành công")
                .data(driverService.updateLocation(driverId, request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/detail/{driverId}")
    public ResponseEntity<ApiResponse<DriverResponse>> getDriver(@PathVariable("driverId") String driverId) {
        ApiResponse<DriverResponse> apiResponse = ApiResponse.<DriverResponse>builder()
                .code("driver-s-04")
                .message("Lấy thông tin tài xế thành công")
                .data(driverService.getDriver(driverId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }


}
