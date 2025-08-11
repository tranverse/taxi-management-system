package com.gis.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateAccountRequest {
    @NotBlank(message = "Bạn chưa nhập tên nhân viên")
    String name;

    @NotBlank(message = "Bạn chưa nhập email nhân viên")
    String email;

    @NotBlank(message = "Bạn chưa nhập số điện thoại nhân viên")
    String phone;

    @NotNull(message = "Bạn chưa chọn giới tính")
    Boolean gender;
}
