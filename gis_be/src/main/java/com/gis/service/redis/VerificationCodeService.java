package com.gis.service.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gis.dto.auth.AuthCustomerRegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class VerificationCodeService {
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public String generateVerificationCode(String email, String name, String password) throws JsonProcessingException {
        String verificationCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6);
        Map<String, String> userData = new HashMap<>();
        userData.put("email", email);
        userData.put("name", name);
        userData.put("password", password);
        String jsonUserData = objectMapper.writeValueAsString(userData);
        stringRedisTemplate.opsForValue().set(verificationCode, jsonUserData, 5, TimeUnit.MINUTES);
        return verificationCode;
    }

    public void deleteVerificationCode(String verificationCode) {
        stringRedisTemplate.delete(verificationCode);
    }

    public AuthCustomerRegisterRequest get(String verificationCode) throws JsonProcessingException {
        String jsonUserData = stringRedisTemplate.opsForValue().get(verificationCode);
        if (jsonUserData == null) {
            throw new IllegalArgumentException("Verification code is invalid or expired.");
        }
        Map<String, String> userData = objectMapper.readValue(jsonUserData, new TypeReference<Map<String, String>>(){});
        AuthCustomerRegisterRequest request = new AuthCustomerRegisterRequest();
        request.setEmail(userData.get("email"));
        request.setName(userData.get("name"));
        request.setPassword(userData.get("password"));
        return request;
    }
}
