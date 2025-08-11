package com.gis.service;

import com.gis.dto.auth.*;
import com.gis.dto.customer.CustomerResponse;
import com.gis.dto.driver.DriverResponse;
import com.gis.dto.jwt.JWTPayloadDto;
import com.gis.enums.DriverStatus;
import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
import com.gis.exception.AppException;
import com.gis.mapper.CustomerMapper;
import com.gis.mapper.UserMapper;
import com.gis.model.Customer;
import com.gis.model.RefreshToken;
import com.gis.model.Type;
import com.gis.model.User;
import com.gis.repository.CustomerRepository;
import com.gis.repository.RefreshTokenRepository;
import com.gis.repository.TypeRepository;
import com.gis.repository.UserRepository;
import com.gis.service.redis.VerificationCodeForgotService;
import com.gis.util.PasswordUtil;
import com.gis.util.jwt.AccessTokenUtil;
import com.gis.util.jwt.RefreshTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final TypeRepository typeRepository;
    private final PasswordUtil passwordUtil;
    private final AccessTokenUtil accessTokenUtil;
    private final RefreshTokenUtil refreshTokenUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationCodeForgotService verificationCodeForgotService;

    private final CustomerMapper customerMapper;
    private final UserMapper userMapper;

    public void registerCustomer(AuthCustomerRegisterRequest request) {
        boolean existedCustomer = customerRepository.existsByEmailAndIsOutsideFalse(request.getEmail());
        if (existedCustomer) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Email has existed", "auth-e-01");
        }
    }

    public AuthResponse verifyRegisterCustomer(AuthCustomerRegisterRequest request) {
        boolean existedCustomer = customerRepository.existsByEmailAndIsOutsideFalse(request.getEmail());
        if (existedCustomer) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Email has existed", "auth-e-01");
        }
        String hashedPassword = passwordUtil.encodePassword(request.getPassword());
        request.setPassword(hashedPassword);
        Type type = typeRepository.findByName("Thành viên");
        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(ERole.CUSTOMER)
                .isOutside(false)
                .status(UserStatus.ACTIVE)
                .accumulate(0L)
                .total(0L)
                .type(type)
                .build();
        customerRepository.save(customer);
        String accessTokenString = accessTokenUtil.generateTokenCustomer(customerMapper.toJWTPayloadDto(customer));
        String refreshTokenString = refreshTokenUtil.generateTokenCustomer(customerMapper.toJWTPayloadDto(customer), customer);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .refreshToken(refreshTokenString)
                .build();
    }

    public AuthResponse loginCustomer(AuthCustomerLoginRequest request) {
        Customer customer = customerRepository.findByEmailAndIsOutsideFalse(request.getEmail()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Email customer not found", "auth-e-02")
        );
        checkCustomerStatus(customer);
        boolean isMatchPasswordCustomer = passwordUtil.checkPassword(request.getPassword(), customer.getPassword());
        if (!isMatchPasswordCustomer) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Wrong password", "auth-e-03");
        }
        String accessTokenString = accessTokenUtil.generateTokenCustomer(customerMapper.toJWTPayloadDto(customer));
        String refreshTokenString = refreshTokenUtil.generateTokenCustomer(customerMapper.toJWTPayloadDto(customer), customer);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .refreshToken(refreshTokenString)
                .build();
    }

    public AuthResponse loginOAuth2Success(OAuth2User oAuth2User) {
        String providerName = oAuth2User.getAttribute("provider");
        String userOAuthId;
        if ("google".equals(providerName)) {
            userOAuthId = oAuth2User.getAttribute("sub"); // Google sử dụng "sub" làm ID
        } else if ("facebook".equals(providerName)) {
            userOAuthId = oAuth2User.getAttribute("id"); // Facebook sử dụng "id"
        } else {
            throw new IllegalArgumentException("Unsupported OAuth2 provider: " + providerName);
        }
        Type type = typeRepository.findByName("Thành viên");
        Customer customer = customerRepository.findByIsOutsideTrueAndProviderNameAndProviderId(providerName, userOAuthId)
                .orElseGet(() -> {
                    Customer newCustomer = Customer.builder()
                            .id(UUID.randomUUID().toString())
                            .email(oAuth2User.getAttribute("email"))
                            .name(oAuth2User.getAttribute("name"))
                            .isOutside(true)
                            .providerId(userOAuthId)
                            .providerName(providerName)
                            .avatar(oAuth2User.getAttribute("picture"))
                            .role(ERole.CUSTOMER)
                            .status(UserStatus.ACTIVE)
                            .type(type)
                            .accumulate(0L)
                            .total(0L)
                            .build();
                    return customerRepository.save(newCustomer);
                });
        checkCustomerStatus(customer);
        JWTPayloadDto payload = customerMapper.toJWTPayloadDto(customer);
        String accessToken = accessTokenUtil.generateTokenCustomer(payload);
        String refreshToken = refreshTokenUtil.generateTokenCustomer(payload, customer);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthResponse refreshTokenCustomer(AuthRefreshTokenRequest request) {
        JWTPayloadDto payload = refreshTokenUtil.verifyTokenCustomer(request.getRefreshToken());
        String accessTokenString = accessTokenUtil.generateTokenCustomer(payload);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .build();
    }


    public AuthResponse loginUser(AuthUserLoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Email customer not found", "auth-e-02")
        );
        checkUserStatus(user);
        boolean isMatchPasswordUser = passwordUtil.checkPassword(request.getPassword(), user.getPassword());
        if (!isMatchPasswordUser) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Wrong password", "auth-e-03");
        }
        if (user.getRole() == ERole.DRIVER && user.getDriverStatus() == DriverStatus.OFF){
            user.setDriverStatus(DriverStatus.FREE);
        }
        if (request.getLatitude() != null && request.getLongitude() != null) {
            user.setTime(LocalDateTime.now());
            user.setLatitude(request.getLatitude());
            user.setLongitude(request.getLongitude());
            userRepository.save(user);
        }
        String accessTokenString = accessTokenUtil.generateTokenUser(userMapper.toJWTPayloadDto(user));
        String refreshTokenString = refreshTokenUtil.generateTokenUser(userMapper.toJWTPayloadDto(user), user);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .refreshToken(refreshTokenString)
                .build();
    }

    public AuthResponse refreshTokenUser(AuthRefreshTokenRequest request) {
        JWTPayloadDto payload = refreshTokenUtil.verifyTokenUser(request.getRefreshToken());
        String accessTokenString = accessTokenUtil.generateTokenUser(payload);
        return AuthResponse.builder()
                .accessToken(accessTokenString)
                .build();
    }

    public void logOutUser(AuthLogOutRequest request) {
        JWTPayloadDto payload = refreshTokenUtil.verifyTokenUser(request.getRefreshToken());
        RefreshToken refreshToken = refreshTokenRepository
                .findByUserId(payload.getId())
                .orElseThrow(
                        () -> new AppException(HttpStatus.NOT_FOUND, "Refresh token not found", "auth-e-04")
                );
        refreshToken.setToken(null);
        refreshTokenRepository.save(refreshToken);

        User user = userRepository.findById(payload.getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "User not found", "user-e-01"));
        if (user.getDriverStatus() != null) {
            user.setDriverStatus(DriverStatus.OFF);
            userRepository.save(user);
        }
    }

    private void checkCustomerStatus(Customer customer){
        if(!customer.getStatus().equals(UserStatus.ACTIVE)){
            throw new AppException(HttpStatus.BAD_REQUEST, "Customer is not active", "auth-e-06");
        }
    }

    private void checkUserStatus(User user){
        if(!user.getStatus().equals(UserStatus.ACTIVE)){
            throw new AppException(HttpStatus.BAD_REQUEST, "User is not active", "auth-e-07");
        }
    }

    public CustomerResponse getInfoCustomer(String customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Customer not found", "auth-e-05"));
        return customerMapper.toCustomerResponse(customer);
    }

    public DriverResponse getInfoUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "User not found", "auth-e-05"));
        return userMapper.toDriverResponse(user);
    }
}
