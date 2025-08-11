package com.gis.controller;

import com.gis.dto.ApiResponse;
import com.gis.dto.driver.DriverResponse;
import com.gis.dto.statistic.RevenueByDateResponse;
import com.gis.service.StatisticService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statistic")
public class StatisticController {
    public final StatisticService statisticService;

    @GetMapping("/revenue-by-driver/{driverId}")
    public ResponseEntity<ApiResponse<List<RevenueByDateResponse>>> revenueByDriver(@PathVariable("driverId") String driverId) {

        ApiResponse<List<RevenueByDateResponse>> apiResponse = ApiResponse.<List<RevenueByDateResponse>>builder()
                .code("driver-s-04")
                .message("Lấy doanh thu theo ngày của tài xế thành công ")
                .data(statisticService.revenueByDriverPerDay(driverId))
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }


}
