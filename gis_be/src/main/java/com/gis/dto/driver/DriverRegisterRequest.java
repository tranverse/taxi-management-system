package com.gis.dto.driver;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DriverRegisterRequest {

    @NotBlank(message = "Bạn chưa nhập tên")
    String name;

    @NotBlank(message = "Bạn chưa nhập số điện thoại")
    String phone;

    @NotBlank(message = "Bạn chưa nhập email")
    @Email(message = "Email chưa đúng định dạng")
    String email;

    @NotNull(message = "Bạn chưa nhập giới tính")
    Boolean gender;

    @NotNull(message = "Bạn chưa nhập giấy phép lái xe")
    String driverLicense;

    @NotBlank(message = "Bạn chưa nhập tài khoản")
    String username;

    @NotBlank(message = "Bạn chưa nhập mật khẩu")
    String password;
}
