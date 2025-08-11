package com.gis.util.jwt;

import com.gis.dto.jwt.JWTPayloadDto;
import com.gis.exception.AppException;
import com.gis.model.Customer;
import com.gis.model.RefreshToken;
import com.gis.model.User;
import com.gis.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RefreshTokenUtil extends BaseJWTUtil {
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refresh.secret}")
    private String refreshSecret;

    @Value("${app.jwt.refresh.expiration}")
    private long refreshExpiration;

    @Override
    protected String getSecret() {
        return refreshSecret;
    }

    @Override
    protected long getExpiration() {
        return refreshExpiration;
    }

    public String generateTokenCustomer(JWTPayloadDto payload, Customer customer) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByCustomer(customer)
                .orElseGet(() -> RefreshToken.builder().customer(customer).build());
        String token = super.generateTokenCustomer(payload);
        refreshToken.setToken(token);
        refreshTokenRepository.save(refreshToken);
        return token;
    }

    public String generateTokenUser(JWTPayloadDto payload, User user) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByUser(user)
                .orElseGet(() -> RefreshToken.builder().user(user).build());
        String token = super.generateTokenUser(payload);
        refreshToken.setToken(token);
        refreshTokenRepository.save(refreshToken);
        return token;
    }


    @Override
    public JWTPayloadDto verifyTokenCustomer(String token) {
        JWTPayloadDto payload = super.verifyTokenCustomer(token);
        RefreshToken refreshToken =  refreshTokenRepository
                .findByCustomerId(payload.getId())
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Refresh token not found", "auth-e-01")
                );
        if(refreshToken.getToken() == null || !refreshToken.getToken().equals(token)){
            throw new AppException(HttpStatus.NOT_FOUND, "Refresh token not found", "auth-e-01");
        }
        return payload;
    }

    @Override
    public JWTPayloadDto verifyTokenUser(String token) {
        JWTPayloadDto payload = super.verifyTokenUser(token);
        RefreshToken refreshToken =  refreshTokenRepository
                .findByUserId(payload.getId())
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Refresh token not found", "auth-e-01")
                );
        if(refreshToken.getToken() == null || !refreshToken.getToken().equals(token)){
            throw new AppException(HttpStatus.NOT_FOUND, "Refresh token not found", "auth-e-01");
        }
        return payload;
    }


}
