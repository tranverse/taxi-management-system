package com.gis.service;

import com.gis.dto.mail.SendEmailDto;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String systemEmail;

    public void sendEmail(SendEmailDto emailPayload) {
        var message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(emailPayload.getTo());
            helper.setSubject(emailPayload.getSubject());
            helper.setText(emailPayload.getText(), true);
            helper.setFrom(systemEmail);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendEmailToVerifyRegister(String toEmail, String verificationCode, String name) {
        String verifyUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/auth/register/verify/{verificationCode}")
                .buildAndExpand(verificationCode)
                .toUriString();
        String content = loadEmailTemplate("templates/mail/register.html");
        content = content.replace("{{verifyUrl}}", verifyUrl)
                .replace("{{name}}", name)
                .replace("{{logoUrl}}", "http://localhost:8080/static/images/logo.png");

        SendEmailDto emailPayload = SendEmailDto.builder()
                .to(toEmail)
                .subject("VERIFY EMAIL FROM eNHA")
                .text(content)
                .build();
        sendEmail(emailPayload);
    }

    public void sendEmailToWelcome(String toEmail, String name) {
        String content = loadEmailTemplate("templates/mail/welcome.html");
        content = content.replace("{{name}}", name)
                .replace("{{logoUrl}}", "http://localhost:8080/static/images/logo.png");

        SendEmailDto emailPayload = SendEmailDto.builder()
                .to(toEmail)
                .subject("eNHA WELCOME")
                .text(content)
                .build();
        sendEmail(emailPayload);
    }

    public void sendEmailToVerifyForgotPassword(String toEmail, String verificationCode) {
        String content = loadEmailTemplate("templates/mail/forgot-password.html");
        content = content.replace("{{emailCode}}", verificationCode);
        SendEmailDto emailPayload = SendEmailDto.builder()
                .to(toEmail)
                .subject("RECOVERY PASSWORD FROM eNHA")
                .text(content)
                .build();
        sendEmail(emailPayload);
    }

    private String loadEmailTemplate(String filePath) {
        try {
            ClassPathResource resource = new ClassPathResource(filePath);
            byte[] fileData = StreamUtils.copyToByteArray(resource.getInputStream());
            return new String(fileData, StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "";
        }
    }
}
