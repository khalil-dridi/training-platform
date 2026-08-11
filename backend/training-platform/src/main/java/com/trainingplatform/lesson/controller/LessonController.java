package com.trainingplatform.lesson.controller;

import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.lesson.dto.request.CreateLessonRequest;
import com.trainingplatform.lesson.dto.request.UpdateLessonRequest;
import com.trainingplatform.lesson.dto.response.LessonResponse;
import com.trainingplatform.lesson.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            Authentication authentication,
            @Valid @ModelAttribute CreateLessonRequest request,
            @RequestPart("video") MultipartFile video
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<LessonResponse>builder()
                        .success(true)
                        .message("Lesson created successfully.")
                        .data(
                                lessonService.createLesson(
                                        authentication,
                                        request,
                                        video
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getChapterLessons(
            Authentication authentication,
            @PathVariable Long chapterId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<LessonResponse>>builder()
                        .success(true)
                        .message("Lessons retrieved successfully.")
                        .data(
                                lessonService.getChapterLessons(
                                        authentication,
                                        chapterId
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateLessonRequest request,
            @RequestPart(value = "video", required = false)
            MultipartFile video
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<LessonResponse>builder()
                        .success(true)
                        .message("Lesson updated successfully.")
                        .data(
                                lessonService.updateLesson(
                                        authentication,
                                        id,
                                        request,
                                        video
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(
            Authentication authentication,
            @PathVariable Long id
    ) throws IOException {

        lessonService.deleteLesson(authentication, id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Lesson deleted successfully.")
                        .build()
        );
    }
    @PreAuthorize("hasRole('LEARNER')")
    @GetMapping("/learner/chapter/{chapterId}")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLearnerChapterLessons(
            Authentication authentication,
            @PathVariable Long chapterId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<LessonResponse>>builder()
                        .success(true)
                        .message("Chapter lessons retrieved successfully.")
                        .data(
                                lessonService.getLearnerChapterLessons(
                                        authentication,
                                        chapterId
                                )
                        )
                        .build()
        );
    }

}
