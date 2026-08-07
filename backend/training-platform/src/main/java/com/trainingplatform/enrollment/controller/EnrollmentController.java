package com.trainingplatform.enrollment.controller;

import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.enrollment.dto.response.EnrollmentResponse;
import com.trainingplatform.enrollment.dto.resquest.UpdateProgressRequest;
import com.trainingplatform.enrollment.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PreAuthorize("hasRole('LEARNER')")
    @PostMapping("/{courseId}")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            Authentication authentication,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<EnrollmentResponse>builder()
                        .success(true)
                        .message("Enrollment completed successfully.")
                        .data(
                                enrollmentService.enroll(
                                        authentication,
                                        courseId
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('LEARNER')")
    @GetMapping("/my-courses")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getMyCourses(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<EnrollmentResponse>>builder()
                        .success(true)
                        .message("My courses retrieved successfully.")
                        .data(
                                enrollmentService.getMyCourses(authentication)
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getCourseEnrollments(
            Authentication authentication,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<EnrollmentResponse>>builder()
                        .success(true)
                        .message("Course enrollments retrieved successfully.")
                        .data(
                                enrollmentService.getCourseEnrollments(
                                        authentication,
                                        courseId
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('LEARNER')")
    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> getEnrollment(
            Authentication authentication,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<EnrollmentResponse>builder()
                        .success(true)
                        .message("Enrollment retrieved successfully.")
                        .data(
                                enrollmentService.getEnrollment(
                                        authentication,
                                        courseId
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('LEARNER')")
    @PatchMapping("/{courseId}/progress")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> updateProgress(
            Authentication authentication,
            @PathVariable Long courseId,
            @Valid @RequestBody UpdateProgressRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<EnrollmentResponse>builder()
                        .success(true)
                        .message("Progress updated successfully.")
                        .data(
                                enrollmentService.updateProgress(
                                        authentication,
                                        courseId,
                                        request
                                )
                        )
                        .build()
        );
    }

}