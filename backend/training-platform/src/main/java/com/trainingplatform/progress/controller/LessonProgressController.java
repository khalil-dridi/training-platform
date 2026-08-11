package com.trainingplatform.progress.controller;


import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.progress.dto.response.LessonProgressResponse;
import com.trainingplatform.progress.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson-progress")
@RequiredArgsConstructor
public class LessonProgressController {

    private final LessonProgressService lessonProgressService;

    @PreAuthorize("hasRole('LEARNER')")
    @PatchMapping("/{lessonId}/complete")
    public ResponseEntity<ApiResponse<LessonProgressResponse>> completeLesson(
            Authentication authentication,
            @PathVariable Long lessonId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LessonProgressResponse>builder()
                        .success(true)
                        .message("Lesson marked as completed.")
                        .data(
                                lessonProgressService.completeLesson(
                                        authentication,
                                        lessonId
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('LEARNER')")
    @PatchMapping("/{lessonId}/uncomplete")
    public ResponseEntity<ApiResponse<LessonProgressResponse>> uncompleteLesson(
            Authentication authentication,
            @PathVariable Long lessonId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<LessonProgressResponse>builder()
                        .success(true)
                        .message("Lesson marked as incomplete.")
                        .data(
                                lessonProgressService.uncompleteLesson(
                                        authentication,
                                        lessonId
                                )
                        )
                        .build()
        );
    }
    @PreAuthorize("hasRole('LEARNER')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<LessonProgressResponse>>> getCourseProgress(
            Authentication authentication,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<LessonProgressResponse>>builder()
                        .success(true)
                        .message("Course lesson progress retrieved successfully.")
                        .data(
                                lessonProgressService.getCourseProgress(
                                        authentication,
                                        courseId
                                )
                        )
                        .build()
        );
    }
}