package com.gis.service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class VerificationCodeForgotService {
    private final StringRedisTemplate stringRedisTemplate;

    private String generateRandomCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000; // Tạo số ngẫu nhiên trong khoảng từ 100000 đến 999999
        return String.valueOf(code);
    }

    public String generateForgotCode(String email) {
        String randomCode = generateRandomCode();
        stringRedisTemplate.opsForValue().set(randomCode, email, 5, TimeUnit.MINUTES);
        return randomCode;
    }

    public void deleteForgotCode(String forgotCode) {
        stringRedisTemplate.delete(forgotCode);
    }

    // Lấy email từ mã OTP
    public String getEmailFromForgotCode(String forgotCode) {
        return stringRedisTemplate.opsForValue().get(forgotCode);
    }

    public boolean isCodeValid(String code, String email) {
        String storedEmail = stringRedisTemplate.opsForValue().get(code);
        return email.equals(storedEmail);
    }

}
