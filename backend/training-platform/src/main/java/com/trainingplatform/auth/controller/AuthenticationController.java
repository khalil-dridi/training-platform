package com.trainingplatform.auth.controller;

import com.trainingplatform.auth.dto.request.LoginRequest;
import com.trainingplatform.auth.dto.request.RegisterRequest;
import com.trainingplatform.auth.dto.response.AuthenticationResponse;
import com.trainingplatform.auth.dto.response.UserResponse;
import com.trainingplatform.auth.service.AuthenticationService;
import com.trainingplatform.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        UserResponse response = authenticationService.register(request);

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User registered successfully")
                .data(response)
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        AuthenticationResponse response = authenticationService.login(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build();
    }
}