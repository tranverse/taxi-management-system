package com.gis.service;

import com.gis.dto.statistic.RevenueByDateResponse;
import com.gis.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticService {
    private final BookingRepository bookingRepository;


    public List<RevenueByDateResponse> revenueByDriverPerDay(String driverId) {
        List<Object[]> results = bookingRepository.findRevenueByDriverPerDay(driverId);

        return results.stream().map(result -> new RevenueByDateResponse(
                (Date) result[0],
                ((Number) result[1]).doubleValue(),
                ((Number) result[2]).intValue()
        )).collect(Collectors.toList());
    }

}
