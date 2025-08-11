package com.gis.dto.review;

import com.gis.model.Booking;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class ReviewRequest {
    private Booking booking;
    private List<ReviewCriteria> criteriaList;
    private String text;

    @Getter
    public static class ReviewCriteria {
        private String criteriaId;
        private String name;
        @Getter
        @Size(min = 1, max = 5, message = "Tối thiểu 1 sao, tối đa 5 sao")
        private Integer star;
    }
}
