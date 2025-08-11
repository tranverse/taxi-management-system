package com.gis.dto.criteria;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CriteriaResponse {
    String id;
    String name;
}
