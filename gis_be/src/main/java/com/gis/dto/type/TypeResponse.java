package com.gis.dto.type;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TypeResponse {
    String id;
    String name;
    Double reducedRate;
    Long point;
}
