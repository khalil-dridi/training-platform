package com.trainingplatform.course.controller;

import com.trainingplatform.common.dto.response.ApiResponse;
import com.trainingplatform.course.dto.request.CreateCourseRequest;
import com.trainingplatform.course.dto.request.UpdateCourseRequest;
import com.trainingplatform.course.dto.response.CourseResponse;
import com.trainingplatform.course.service.CourseService;
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
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            Authentication authentication,
            @Valid @ModelAttribute CreateCourseRequest request,
            @RequestPart("thumbnail") MultipartFile thumbnail
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<CourseResponse>builder()
                        .success(true)
                        .message("Course created successfully.")
                        .data(
                                courseService.createCourse(
                                        authentication,
                                        request,
                                        thumbnail
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyCourses(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<CourseResponse>>builder()
                        .success(true)
                        .message("Courses retrieved successfully.")
                        .data(courseService.getMyCourses(authentication))
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateCourseRequest request,
            @RequestPart(value = "thumbnail", required = false)
            MultipartFile thumbnail
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<CourseResponse>builder()
                        .success(true)
                        .message("Course updated successfully.")
                        .data(
                                courseService.updateCourse(
                                        authentication,
                                        id,
                                        request,
                                        thumbnail
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            Authentication authentication,
            @PathVariable Long id
    ) throws IOException {

        courseService.deleteCourse(authentication, id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Course deleted successfully.")
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<CourseResponse>> publishCourse(
            Authentication authentication,
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CourseResponse>builder()
                        .success(true)
                        .message("Course published successfully.")
                        .data(
                                courseService.publishCourse(
                                        authentication,
                                        id
                                )
                        )
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPublishedCourses() {

        return ResponseEntity.ok(
                ApiResponse.<List<CourseResponse>>builder()
                        .success(true)
                        .message("Courses retrieved successfully.")
                        .data(courseService.getPublishedCourses())
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getPublishedCourse(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CourseResponse>builder()
                        .success(true)
                        .message("Course retrieved successfully.")
                        .data(courseService.getPublishedCourse(id))
                        .build()
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPublishedCoursesByCategory(
            @PathVariable Long categoryId
    ) {

        return ResponseEntity.ok(
                ApiResponse.<List<CourseResponse>>builder()
                        .success(true)
                        .message("Courses retrieved successfully.")
                        .data(
                                courseService.getPublishedCoursesByCategory(
                                        categoryId
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/me/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getMyCourseById(
            Authentication authentication,
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CourseResponse>builder()
                        .success(true)
                        .message("Course retrieved successfully.")
                        .data(
                                courseService.getMyCourseById(
                                        authentication,
                                        id
                                )
                        )
                        .build()
        );
    }
}