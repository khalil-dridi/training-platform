package com.trainingplatform.category.controller;

import com.trainingplatform.category.dto.request.CreateCategoryRequest;
import com.trainingplatform.category.dto.request.UpdateCategoryRequest;
import com.trainingplatform.category.dto.response.CategoryResponse;
import com.trainingplatform.category.service.CategoryService;
import com.trainingplatform.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @ModelAttribute CreateCategoryRequest request,
            @RequestPart("image") MultipartFile image
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<CategoryResponse>builder()
                        .success(true)
                        .message("Category created successfully.")
                        .data(
                                categoryService.createCategory(
                                        request,
                                        image
                                )
                        )
                        .build()
        );
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {

        return ResponseEntity.ok(
                ApiResponse.<List<CategoryResponse>>builder()
                        .success(true)
                        .message("Categories retrieved successfully.")
                        .data(categoryService.getAllCategories())
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.<CategoryResponse>builder()
                        .success(true)
                        .message("Category retrieved successfully.")
                        .data(categoryService.getCategoryById(id))
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateCategoryRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        return ResponseEntity.ok(
                ApiResponse.<CategoryResponse>builder()
                        .success(true)
                        .message("Category updated successfully.")
                        .data(
                                categoryService.updateCategory(
                                        id,
                                        request,
                                        image
                                )
                        )
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id
    ) throws IOException {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Category deleted successfully.")
                        .build()
        );
    }
}