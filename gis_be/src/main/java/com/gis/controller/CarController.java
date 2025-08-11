package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.car.CarCreateRequest;
import com.gis.dto.car.CarResponse;
import com.gis.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/car")
@RequiredArgsConstructor

public class CarController {
    private final CarService carService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<CarResponse>> createCar(@Valid @RequestBody CarCreateRequest request){
        ApiResponse<CarResponse> apiResponse = ApiResponse.<CarResponse>builder()
                .code("car-s-01")
                .data(carService.createCar(request))
                .message("Thêm xe thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
