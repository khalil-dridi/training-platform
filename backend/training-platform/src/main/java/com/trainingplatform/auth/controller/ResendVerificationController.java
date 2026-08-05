package com.trainingplatform.auth.controller;

import com.trainingplatform.auth.service.ResendVerificationService;
import com.trainingplatform.common.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ResendVerificationController {

    private final ResendVerificationService resendVerificationService;

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerificationEmail(
            @RequestParam String email
    ) {

        resendVerificationService.resendVerificationEmail(email);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Verification email sent successfully.")
                        .build()
        );
    }

}