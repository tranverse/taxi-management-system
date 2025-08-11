package com.gis.config;

import com.gis.security.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService oAuth2UserService;
    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    private final String[] POST_PUBLIC_ROUTES = {"/auth/**", "/", "/oauth2/**", "/driver/**", "/status/**"};
    private final String[] GET_PUBLIC_ROUTES = {"/auth/**", "/", "/oauth2/**", "/driver/**"};


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép tất cả các nguồn
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

        // Cho phép tất cả các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Cho phép tất cả các headers
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Không cần cấu hình allowCredentials nếu cho phép mọi nguồn mà không cần gửi cookie
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L); // Giới hạn thời gian cache

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf.disable()) // Disable CSRF if not needed
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with your configuration
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, POST_PUBLIC_ROUTES).permitAll()
                        .requestMatchers(HttpMethod.GET, GET_PUBLIC_ROUTES).permitAll()
                        .requestMatchers(("/css/**")).permitAll()
                        .requestMatchers(("/js/**")).permitAll()
                        .requestMatchers(("/json/**")).permitAll()
                        .requestMatchers(("/images/**")).permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/driver/**").permitAll()
                        .anyRequest().authenticated()
                );

        httpSecurity.sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));

        httpSecurity.oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuth2UserService)
                        )
                        .defaultSuccessUrl("/auth/login/oauth2/success", true)
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(jwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter)
                        )
                );

        return httpSecurity.build();
    }
}