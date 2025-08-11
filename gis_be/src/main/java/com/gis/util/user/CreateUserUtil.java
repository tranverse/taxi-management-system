package com.gis.util.user;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Random;

@Component
public class CreateUserUtil {
    public String generateUsername(String fullName) {
        // Tách tên đầy đủ thành các phần (họ, tên lót, tên)
        String[] parts = fullName.trim().split("\\s+");

        // Kiểm tra nếu tên không có ít nhất 2 phần (họ và tên)
        if (parts.length < 2) {
            throw new IllegalArgumentException("Tên đầy đủ phải có ít nhất họ và tên.");
        }

        // Khởi tạo chuỗi username
        StringBuilder username = new StringBuilder();

        // Lấy chữ cái đầu của mỗi phần (họ, tên lót) và loại bỏ dấu
        for (int i = 0; i < parts.length - 1; i++) {
            // Chuyển ký tự đầu thành String trước khi gọi removeVietnameseTones
            username.append(removeVietnameseTones(String.valueOf(parts[i].toLowerCase().charAt(0))));
        }

        // Lấy toàn bộ tên cuối và loại bỏ dấu
        username.append(removeVietnameseTones(parts[parts.length - 1].toLowerCase()));  // Toàn bộ tên cuối, chuyển thành chữ thường và loại bỏ dấu

        // Thêm 4 số ngẫu nhiên
        Random random = new Random();
        int randomNumber = random.nextInt(9000) + 1000; // Sinh số ngẫu nhiên từ 1000 đến 9999
        username.append(randomNumber);

        return username.toString();
    }

    // Hàm loại bỏ dấu tiếng Việt
    private String removeVietnameseTones(String input) {
        // Chuyển chuỗi sang dạng không có dấu
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "");
    }

    public String generatePassword() {
        Random random = new Random();
        int password = random.nextInt(90000000) + 10000000; // Sinh một số ngẫu nhiên trong khoảng từ 10000000 đến 99999999
        return String.valueOf(password);  // Trả về mật khẩu dưới dạng chuỗi
    }
}
