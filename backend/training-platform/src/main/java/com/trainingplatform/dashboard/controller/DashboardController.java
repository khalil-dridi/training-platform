package com.trainingplatform.dashboard.controller;


import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.dashboard.dto.response.AdminDashboardResponse;
import com.trainingplatform.dashboard.dto.response.LearnerDashboardResponse;
import com.trainingplatform.dashboard.dto.response.TrainerDashboardResponse;
import com.trainingplatform.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {

        return ResponseEntity.ok(
                ApiResponse.<AdminDashboardResponse>builder()
                        .success(true)
                        .message("Admin dashboard retrieved successfully.")
                        .data(dashboardService.getAdminDashboard())
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/trainer")
    public ResponseEntity<ApiResponse<TrainerDashboardResponse>> getTrainerDashboard(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ApiResponse.<TrainerDashboardResponse>builder()
                        .success(true)
                        .message("Trainer dashboard retrieved successfully.")
                        .data(
                                dashboardService.getTrainerDashboard(authentication)
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('LEARNER')")
    @GetMapping("/learner")
    public ResponseEntity<ApiResponse<LearnerDashboardResponse>> getLearnerDashboard(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LearnerDashboardResponse>builder()
                        .success(true)
                        .message("Learner dashboard retrieved successfully.")
                        .data(
                                dashboardService.getLearnerDashboard(authentication)
                        )
                        .build()
        );
    }
}