package com.trainingplatform.category.service;

import com.trainingplatform.category.dto.request.UpdateCategoryRequest;
import com.trainingplatform.category.mapper.CategoryMapper;
import com.trainingplatform.category.repository.CategoryRepository;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.storage.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.trainingplatform.category.dto.request.CreateCategoryRequest;
import com.trainingplatform.category.dto.response.CategoryResponse;
import com.trainingplatform.category.entity.Category;
import com.trainingplatform.storage.dto.CloudinaryResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public CategoryResponse createCategory(
            CreateCategoryRequest request,
            MultipartFile image
    ) throws IOException {

        if (categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Category name already exists."
            );
        }

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException(
                    "Category image is required."
            );
        }

        CloudinaryResponse imageResponse =
                cloudinaryService.uploadImage(
                        image,
                        "training-platform/categories"
                );

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(imageResponse.getUrl())
                .imagePublicId(imageResponse.getPublicId())
                .build();

        categoryRepository.save(category);

        return categoryMapper.toResponse(category);
    }

    @Transactional
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found.")
                );

        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(
            Long id,
            UpdateCategoryRequest request,
            MultipartFile image
    ) throws IOException {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found.")
                );

        if (!category.getName().equalsIgnoreCase(request.getName())
                && categoryRepository.existsByName(request.getName())) {

            throw new IllegalArgumentException(
                    "Category name already exists."
            );
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        if (image != null && !image.isEmpty()) {

            if (category.getImagePublicId() != null
                    && !category.getImagePublicId().isBlank()) {

                cloudinaryService.deleteImage(category.getImagePublicId());
            }

            CloudinaryResponse response =
                    cloudinaryService.uploadImage(
                            image,
                            "training-platform/categories"
                    );

            category.setImageUrl(response.getUrl());
            category.setImagePublicId(response.getPublicId());
        }

        categoryRepository.save(category);

        return categoryMapper.toResponse(category);
    }

    @Transactional
    public void deleteCategory(Long id) throws IOException {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found.")
                );

        if (category.getImagePublicId() != null
                && !category.getImagePublicId().isBlank()) {

            cloudinaryService.deleteImage(category.getImagePublicId());
        }

        categoryRepository.delete(category);
    }

}