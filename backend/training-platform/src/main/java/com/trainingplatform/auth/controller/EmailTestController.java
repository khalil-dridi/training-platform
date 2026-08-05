package com.trainingplatform.auth.controller;

import com.trainingplatform.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    @GetMapping("/api/test/email")
    public String sendTestEmail() {

        emailService.sendEmail(
                "khalildridi859@gmail.com",
                "Training Platform",
                "Congratulations! Your Spring Boot application is successfully sending emails with Brevo."
        );

        return "Email sent successfully.";
    }

}