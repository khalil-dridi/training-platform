package com.trainingplatform.chapter.controller;

import com.trainingplatform.chapter.dto.request.CreateChapterRequest;
import com.trainingplatform.chapter.dto.request.UpdateChapterRequest;
import com.trainingplatform.chapter.dto.response.ChapterResponse;
import com.trainingplatform.chapter.service.ChapterService;
import com.trainingplatform.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ChapterResponse>> createChapter(
            Authentication authentication,
            @Valid @RequestBody CreateChapterRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<ChapterResponse>builder()
                        .success(true)
                        .message("Chapter created successfully.")
                        .data(
                                chapterService.createChapter(
                                        authentication,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<ChapterResponse>>> getCourseChapters(
            Authentication authentication,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<ChapterResponse>>builder()
                        .success(true)
                        .message("Chapters retrieved successfully.")
                        .data(
                                chapterService.getCourseChapters(
                                        authentication,
                                        courseId
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChapterResponse>> updateChapter(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateChapterRequest request
    ) {

        return ResponseEntity.ok(
                ApiResponse.<ChapterResponse>builder()
                        .success(true)
                        .message("Chapter updated successfully.")
                        .data(
                                chapterService.updateChapter(
                                        authentication,
                                        id,
                                        request
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChapter(
            Authentication authentication,
            @PathVariable Long id
    ) {

        chapterService.deleteChapter(authentication, id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Chapter deleted successfully.")
                        .build()
        );
    }
    @PreAuthorize("hasRole('LEARNER')")
    @GetMapping("/learner/course/{courseId}")
    public ResponseEntity<ApiResponse<List<ChapterResponse>>> getLearnerCourseChapters(
            Authentication authentication,
            @PathVariable Long courseId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<ChapterResponse>>builder()
                        .success(true)
                        .message("Course chapters retrieved successfully.")
                        .data(
                                chapterService.getLearnerCourseChapters(
                                        authentication,
                                        courseId
                                )
                        )
                        .build()
        );
    }

}