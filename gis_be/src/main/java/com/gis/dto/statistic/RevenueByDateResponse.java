package com.gis.dto.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
public class RevenueByDateResponse {
    private Date date;
    private Double revenue;
    private Integer tripCount;
}
