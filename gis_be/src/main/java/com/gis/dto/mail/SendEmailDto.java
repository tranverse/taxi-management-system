package com.gis.dto.mail;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SendEmailDto {
    String to;
    String subject;
    String text;
}
