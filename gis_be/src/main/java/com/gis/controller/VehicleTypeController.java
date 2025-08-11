package com.gis.controller;

import com.cloudinary.Api;
import com.gis.dto.ApiResponse;
import com.gis.dto.vehicleType.VehicleTypeResponse;
import com.gis.service.VehicleTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/vehicle-type")
@RequiredArgsConstructor
public class VehicleTypeController {
    private final VehicleTypeService vehicleTypeService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<List<VehicleTypeResponse>>> getAllVehicleTypes() {
        ApiResponse<List<VehicleTypeResponse>> apiResponse = ApiResponse.<List<VehicleTypeResponse>>builder()
                .code("vehicle-type-s-01")
                .message("Lấy danh sách loại xe thành công")
                .data(vehicleTypeService.getAllVehicleTypes())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
