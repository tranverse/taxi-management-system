package com.gis.util.jwt;

import com.gis.dto.jwt.JWTPayloadDto;
import com.gis.exception.AppException;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jose.util.Base64URL;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;

@Component
public abstract class BaseJWTUtil {
    protected abstract String getSecret();
    protected abstract long getExpiration();

    protected byte[] getSecretKey() {
        return Base64URL.encode(getSecret().getBytes()).decode();
    }

    public String generateTokenCustomer(JWTPayloadDto payload) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(payload.getId())
                    .issuer("ct298-gis.com")
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + getExpiration()))
                    .claim("id", payload.getId())
                    .claim("email", payload.getEmail())
                    .claim("scope", payload.getScope())
                    .build();
            Payload jwtPayload = new Payload(claimsSet.toJSONObject());
            JWSObject object = new JWSObject(header, jwtPayload);
            object.sign(new MACSigner(this.getSecretKey()));
            return object.serialize();
        } catch (JOSEException e) {
            throw new AppException(HttpStatus.UNAUTHORIZED,"JWT error" ,"jwt-e-01");
        }
    }

    public JWTPayloadDto verifyTokenCustomer(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(this.getSecretKey());

            if (!signedJWT.verify(verifier)) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid JWT signature","jwt-e-02");
            }

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Date expirationTime = claimsSet.getExpirationTime();

            if (new Date().after(expirationTime)) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Token has expired","jwt-e-03");
            }

            return JWTPayloadDto.builder()
                    .id(claimsSet.getStringClaim("id"))
                    .email(claimsSet.getStringClaim("email"))
                    .scope(claimsSet.getStringClaim("scope"))
                    .build();
        } catch (ParseException | JOSEException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Failed to verify JWT token", "jwt-e-04");
        }
    }

    public String generateTokenUser(JWTPayloadDto payload) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(payload.getId())
                    .issuer("ct298-gis.com")
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + getExpiration()))
                    .claim("id", payload.getId())
                    .claim("email", payload.getEmail())
                    .claim("scope", payload.getScope())
                    .build();
            Payload jwtPayload = new Payload(claimsSet.toJSONObject());
            JWSObject object = new JWSObject(header, jwtPayload);
            object.sign(new MACSigner(this.getSecretKey()));
            return object.serialize();
        } catch (JOSEException e) {
            throw new AppException(HttpStatus.UNAUTHORIZED,"JWT error" ,"jwt-e-01");
        }
    }

    public JWTPayloadDto verifyTokenUser(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(this.getSecretKey());

            if (!signedJWT.verify(verifier)) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Invalid JWT signature","jwt-e-02");
            }

            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Date expirationTime = claimsSet.getExpirationTime();

            if (new Date().after(expirationTime)) {
                throw new AppException(HttpStatus.UNAUTHORIZED, "Token has expired","jwt-e-03");
            }

            return JWTPayloadDto.builder()
                    .id(claimsSet.getStringClaim("id"))
                    .email(claimsSet.getStringClaim("email"))
                    .scope(claimsSet.getStringClaim("scope"))
                    .build();
        } catch (ParseException | JOSEException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Failed to verify JWT token", "jwt-e-04");
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Date expirationTime = claimsSet.getExpirationTime();
            return new Date().after(expirationTime);
        } catch (ParseException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Failed to parse JWT token", "jwt-e-05");
        }
    }

    public static JWTPayloadDto getPayload(SecurityContext context) {
        Authentication authentication = context.getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return JWTPayloadDto.builder()
                .id(jwt.getClaim("id"))
                .email(jwt.getClaim("email"))
                .scope(jwt.getClaim("scope"))
                .build();
    }

    public static JWTPayloadDto getPayload() {
        SecurityContext context = SecurityContextHolder.getContext();
        return getPayload(context);
    }
}