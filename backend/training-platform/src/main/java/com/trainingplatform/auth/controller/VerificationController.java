package com.trainingplatform.auth.controller;

import com.trainingplatform.auth.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @GetMapping("/api/auth/verify")
    public ResponseEntity<String> verifyEmail(
            @RequestParam String token
    ) {

        verificationService.verifyEmail(token);

        return ResponseEntity.ok("Email verified successfully.");
    }
}