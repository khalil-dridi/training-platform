package com.trainingplatform.user.controller;

import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.user.dto.request.ChangePasswordRequest;
import com.trainingplatform.user.dto.request.UpdateProfileRequest;
import com.trainingplatform.user.dto.response.UserResponse;
import com.trainingplatform.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Profile retrieved successfully.")
                        .data(userService.getCurrentUser(authentication))
                        .build()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Profile updated successfully.")
                        .data(userService.updateProfile(authentication, request))
                        .build()
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        userService.changePassword(authentication, request);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Password changed successfully.")
                        .build()
        );
    }

    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Avatar uploaded successfully.")
                        .data(userService.uploadAvatar(authentication, file))
                        .build()
        );
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> deleteAvatar(
            Authentication authentication
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Avatar deleted successfully.")
                        .data(userService.deleteAvatar(authentication))
                        .build()
        );
    }
}