package com.trainingplatform.course.service;

import com.trainingplatform.category.entity.Category;
import com.trainingplatform.category.repository.CategoryRepository;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.course.dto.request.CreateCourseRequest;
import com.trainingplatform.course.dto.request.UpdateCourseRequest;
import com.trainingplatform.course.dto.response.CourseResponse;
import com.trainingplatform.course.entity.Course;
import com.trainingplatform.course.enums.CourseStatus;
import com.trainingplatform.course.mapper.CourseMapper;
import com.trainingplatform.course.repository.CourseRepository;
import com.trainingplatform.storage.dto.CloudinaryResponse;
import com.trainingplatform.storage.service.CloudinaryService;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.enums.Role;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public CourseResponse createCourse(
            Authentication authentication,
            CreateCourseRequest request,
            MultipartFile thumbnail
    ) throws IOException {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        if (trainer.getRole() != Role.TRAINER) {
            throw new IllegalStateException(
                    "Only trainers can create courses."
            );
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found.")
                );

        if (thumbnail == null || thumbnail.isEmpty()) {
            throw new IllegalArgumentException(
                    "Course thumbnail is required."
            );
        }

        CloudinaryResponse response =
                cloudinaryService.uploadImage(
                        thumbnail,
                        "training-platform/courses"
                );

        Course course = Course.builder()
                .title(request.getTitle())
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .price(request.getPrice())
                .level(request.getLevel())
                .language(request.getLanguage())
                .thumbnailUrl(response.getUrl())
                .thumbnailPublicId(response.getPublicId())
                .status(CourseStatus.DRAFT)
                .category(category)
                .trainer(trainer)
                .build();

        courseRepository.save(course);

        return courseMapper.toResponse(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(
            Authentication authentication
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        return courseRepository.findByTrainer(trainer)
                .stream()
                .map(courseMapper::toResponse)
                .toList();
    }

    @Transactional
    public CourseResponse updateCourse(
            Authentication authentication,
            Long id,
            UpdateCourseRequest request,
            MultipartFile thumbnail
    ) throws IOException {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to update this course."
            );
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found.")
                );

        course.setTitle(request.getTitle());
        course.setShortDescription(request.getShortDescription());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setLevel(request.getLevel());
        course.setLanguage(request.getLanguage());
        course.setCategory(category);

        if (thumbnail != null && !thumbnail.isEmpty()) {

            if (course.getThumbnailPublicId() != null) {
                cloudinaryService.deleteImage(course.getThumbnailPublicId());
            }

            CloudinaryResponse response =
                    cloudinaryService.uploadImage(
                            thumbnail,
                            "training-platform/courses"
                    );

            course.setThumbnailUrl(response.getUrl());
            course.setThumbnailPublicId(response.getPublicId());
        }

        courseRepository.save(course);

        return courseMapper.toResponse(course);
    }

    @Transactional
    public void deleteCourse(
            Authentication authentication,
            Long id
    ) throws IOException {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to delete this course."
            );
        }

        if (course.getThumbnailPublicId() != null
                && !course.getThumbnailPublicId().isBlank()) {

            cloudinaryService.deleteImage(
                    course.getThumbnailPublicId()
            );
        }

        courseRepository.delete(course);
    }

    @Transactional
    public CourseResponse publishCourse(
            Authentication authentication,
            Long id
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to publish this course."
            );
        }

        if (course.getStatus() == CourseStatus.PUBLISHED) {
            throw new IllegalStateException(
                    "Course is already published."
            );
        }

        course.setStatus(CourseStatus.PUBLISHED);

        courseRepository.save(course);

        return courseMapper.toResponse(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getPublishedCourses() {

        return courseRepository.findByStatus(
                        CourseStatus.PUBLISHED
                )
                .stream()
                .map(courseMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse getPublishedCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw new IllegalStateException(
                    "Course is not published."
            );
        }

        return courseMapper.toResponse(course);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getPublishedCoursesByCategory(
            Long categoryId
    ) {

        return courseRepository
                .findByCategoryIdAndStatus(
                        categoryId,
                        CourseStatus.PUBLISHED
                )
                .stream()
                .map(courseMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse getMyCourseById(
            Authentication authentication,
            Long id
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to access this course."
            );
        }

        return courseMapper.toResponse(course);
    }

}