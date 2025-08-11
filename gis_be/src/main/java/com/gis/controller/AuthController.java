package com.gis.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.gis.dto.ApiResponse;
import com.gis.dto.auth.*;
import com.gis.dto.customer.CustomerResponse;
import com.gis.dto.driver.DriverResponse;
import com.gis.security.SecurityUtil;
import com.gis.service.AuthService;
import com.gis.service.EmailService;
import com.gis.service.redis.VerificationCodeForgotService;
import com.gis.service.redis.VerificationCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {
    @Value("${app.clientReceiveTokensPath}")
    private String clientReceiveTokensPath;
    private final AuthService authService;
    private final EmailService emailService;
    private final VerificationCodeService verificationCodeService;
    private final VerificationCodeForgotService verificationCodeForgotService;
    private final SecurityUtil securityUtil;

    //   Customer đăng ký tài khoản
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody @Valid AuthCustomerRegisterRequest request) throws JsonProcessingException {
        authService.registerCustomer(request);
        String verificationCode = verificationCodeService.generateVerificationCode(request.getEmail(), request.getName(), request.getPassword());
        emailService.sendEmailToVerifyRegister(request.getEmail(), verificationCode, request.getName());
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code("auth-s-01")
                .message("Request register successfully, check your email")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //    Customer xác thực đăng ký
    @GetMapping("/register/verify/{verificationCode}")
    public RedirectView verifyRegister(@PathVariable String verificationCode) throws JsonProcessingException {
        AuthCustomerRegisterRequest request =  verificationCodeService.get(verificationCode);
        AuthResponse authResponse = authService.verifyRegisterCustomer(request);
        verificationCodeService.deleteVerificationCode(verificationCode);
        emailService.sendEmailToWelcome(request.getEmail(), request.getName());
        String redirectUrl = UriComponentsBuilder.fromUriString(clientReceiveTokensPath)
                .queryParam("accessToken", authResponse.getAccessToken())
                .queryParam("refreshToken", authResponse.getRefreshToken())
                .toUriString();
        return new RedirectView(redirectUrl);
    }

    //    Customer đăng nhập tài khoản
    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody @Valid AuthCustomerLoginRequest request){
        AuthResponse authResponse = authService.loginCustomer(request);
        ApiResponse<AuthResponse> apiResponse =  ApiResponse.<AuthResponse>builder()
                .data(authResponse)
                .code("auth-s-03")
                .message("Login successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //    Customer đăng nhập bằng Facebook hoặc Google
    @GetMapping("/login/oauth2/success")
    public RedirectView loginOAuth2Success(@AuthenticationPrincipal OAuth2User oAuth2User) {
        AuthResponse authResponse = authService.loginOAuth2Success(oAuth2User);
        String redirectUrl = UriComponentsBuilder.fromUriString(clientReceiveTokensPath)
                .queryParam("accessToken", authResponse.getAccessToken())
                .queryParam("refreshToken", authResponse.getRefreshToken())
                .toUriString();
        return new RedirectView(redirectUrl);
    }

    //    Customer refresh token
    @PostMapping("/refresh-token-customer")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshTokenCustomer(@RequestBody @Valid AuthRefreshTokenRequest request){
        AuthResponse authResponse = authService.refreshTokenCustomer(request);
        ApiResponse<AuthResponse> apiResponse =  ApiResponse.<AuthResponse>builder()
                .data(authResponse)
                .code("auth-s-04")
                .message("Refresh new access token successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //    Customer đăng nhập tài khoản
    @PostMapping("/login-user")
    public ResponseEntity<?> loginUser(@RequestBody @Valid AuthUserLoginRequest request){
        AuthResponse authResponse = authService.loginUser(request);
        ApiResponse<AuthResponse> apiResponse =  ApiResponse.<AuthResponse>builder()
                .data(authResponse)
                .code("auth-s-03")
                .message("Login successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @PostMapping("/logout-user")
    public ResponseEntity<ApiResponse<Void>> logOut(@RequestBody @Valid AuthLogOutRequest request){
        authService.logOutUser(request);
        ApiResponse<Void> apiResponse =  ApiResponse.<Void>builder()
                .code("auth-s-05")
                .message("Log out successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    //    Customer refresh token
    @PostMapping("/refresh-token-user")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshTokenUser(@RequestBody @Valid AuthRefreshTokenRequest request){
        AuthResponse authResponse = authService.refreshTokenUser(request);
        ApiResponse<AuthResponse> apiResponse =  ApiResponse.<AuthResponse>builder()
                .data(authResponse)
                .code("auth-s-04")
                .message("Refresh new access token successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/info-customer")
    public ResponseEntity<ApiResponse<CustomerResponse>> getInfoCustomer(){
        String customerId = securityUtil.getCurrentUserId();
        ApiResponse<CustomerResponse> apiResponse =  ApiResponse.<CustomerResponse>builder()
                .data(authService.getInfoCustomer(customerId))
                .code("auth-s-10")
                .message("Get user info successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }

    @GetMapping("/info-user")
    public ResponseEntity<ApiResponse<DriverResponse>> getInfoUser(){
        String userId = securityUtil.getCurrentUserId();
        ApiResponse<DriverResponse> apiResponse =  ApiResponse.<DriverResponse>builder()
                .data(authService.getInfoUser(userId))
                .code("auth-s-10")
                .message("Get user info successfully")
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
    }
}
