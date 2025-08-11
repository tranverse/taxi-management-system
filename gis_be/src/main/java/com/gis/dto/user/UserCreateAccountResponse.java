package com.gis.dto.user;

import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateAccountResponse {
    String id;
    String name;
    String email;
    String phone;
    Boolean gender;
    String username;
    String password;
    ERole role;
    UserStatus status;
}
