package com.trainingplatform.instructorrequest.controller;

import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.instructorrequest.dto.request.CreateInstructorRequestRequest;
import com.trainingplatform.instructorrequest.dto.response.InstructorRequestResponse;
import com.trainingplatform.instructorrequest.enums.InstructorRequestStatus;
import com.trainingplatform.instructorrequest.service.InstructorRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import java.io.IOException;

@RestController
@RequestMapping("/api/instructor-requests")
@RequiredArgsConstructor
public class InstructorRequestController {

    private final InstructorRequestService instructorRequestService;

    @PreAuthorize("hasRole('LEARNER')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<InstructorRequestResponse>> createRequest(
            Authentication authentication,
            @RequestPart("cv") MultipartFile cv
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<InstructorRequestResponse>builder()
                        .success(true)
                        .message("Instructor request submitted successfully.")
                        .data(
                                instructorRequestService.createRequest(
                                        authentication,
                                        cv
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<Page<InstructorRequestResponse>>> getAllRequests(
            @RequestParam(required = false) InstructorRequestStatus status,
            Pageable pageable
    ) {

        return ResponseEntity.ok(
                ApiResponse.<Page<InstructorRequestResponse>>builder()
                        .success(true)
                        .message("Instructor requests retrieved successfully.")
                        .data(
                                instructorRequestService.getAllRequests(
                                        status,
                                        pageable
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/{id}/approve")
    public ResponseEntity<ApiResponse<InstructorRequestResponse>> approveRequest(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<InstructorRequestResponse>builder()
                        .success(true)
                        .message("Instructor request approved successfully.")
                        .data(instructorRequestService.approveRequest(id))
                        .build()
        );
    }



    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/{id}/reject")
    public ResponseEntity<ApiResponse<InstructorRequestResponse>> rejectRequest(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<InstructorRequestResponse>builder()
                        .success(true)
                        .message("Instructor request rejected successfully.")
                        .data(instructorRequestService.rejectRequest(id))
                        .build()
        );
    }
}
