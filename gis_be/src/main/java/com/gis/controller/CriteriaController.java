package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.criteria.CriteriaResponse;
import com.gis.service.CriteriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/criteria")
@RequiredArgsConstructor

public class CriteriaController {
    private final CriteriaService criteriaService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('DRIVER') or hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<List<CriteriaResponse>>> getAllCriteria(){
        ApiResponse<List<CriteriaResponse>> apiResponse = ApiResponse.<List<CriteriaResponse>>builder()
                .code("criteria-s-01")
                .message("Lấy danh sách tiêu chí thành công")
                .data(criteriaService.getAllCriteria())
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
