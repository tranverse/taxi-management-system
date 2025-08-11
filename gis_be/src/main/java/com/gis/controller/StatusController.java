package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.status.StatusResponse;
import com.gis.dto.status.StatusTraceRequest;
import com.gis.dto.status.StatusUpdateRequest;
import com.gis.service.StatusService;
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
@RequestMapping("/status")
@RequiredArgsConstructor
public class StatusController {
    private final StatusService statusService;

    @PostMapping("/trace")
    public ResponseEntity<ApiResponse<StatusResponse>> trace(@Valid @RequestBody StatusTraceRequest request) {
        ApiResponse<StatusResponse> apiResponse = ApiResponse.<StatusResponse>builder()
                .code("status-s-01")
                .message("Truy vết tài xế thành công")
                .data(statusService.trace(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/update")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse<StatusResponse>> update(@Valid @RequestBody StatusUpdateRequest request) {
        ApiResponse<StatusResponse> apiResponse = ApiResponse.<StatusResponse>builder()
                .code("status-s-01")
                .message("Cập nhật trạng thái chuyến xe thành công")
                .data(statusService.updateStatus(request))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
