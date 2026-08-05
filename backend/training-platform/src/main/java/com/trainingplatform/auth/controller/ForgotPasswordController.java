package com.trainingplatform.auth.controller;

import com.trainingplatform.auth.dto.request.ForgotPasswordRequest;
import com.trainingplatform.auth.service.ForgotPasswordService;
import com.trainingplatform.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        forgotPasswordService.sendResetPasswordEmail(request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Password reset email sent successfully.")
                        .build()
        );
    }

}