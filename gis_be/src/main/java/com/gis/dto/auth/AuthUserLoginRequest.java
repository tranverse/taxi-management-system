package com.gis.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthUserLoginRequest {
    @NotBlank(message = "Tên đăng nhập không được trống")
    String username;

    @NotBlank(message = "Mật khẩu không được trống")
    String password;

    Double latitude;

    Double longitude;
}
