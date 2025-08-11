package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.price.PriceRequest;
import com.gis.dto.price.PriceResponse;
import com.gis.service.PriceService;
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
@RequestMapping("/price")
@RequiredArgsConstructor

public class PriceController {
    private final PriceService priceService;

    @PostMapping("/calculate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PriceResponse>> calculatePrice(@Valid @RequestBody PriceRequest request) {
        ApiResponse<PriceResponse> apiResponse = ApiResponse.<PriceResponse>builder()
                .code("price-s-01")
                .data(priceService.calculatePrice(request))
                .message("Tính tiền thành công")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
