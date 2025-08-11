package com.gis.dto.customer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gis.dto.type.TypeResponse;
import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
import com.gis.model.Type;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class CustomerResponse {
    String id;
    String name;
    String phone;
    String email;
    String avatar;
    Long accumulate;
    Long total;
    UserStatus status;
    ERole role;
    TypeResponse type;
    Boolean isOutside;
}
