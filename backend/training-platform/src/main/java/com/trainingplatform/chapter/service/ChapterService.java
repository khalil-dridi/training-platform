package com.trainingplatform.chapter.service;

import com.trainingplatform.chapter.dto.request.CreateChapterRequest;
import com.trainingplatform.chapter.dto.request.UpdateChapterRequest;
import com.trainingplatform.chapter.dto.response.ChapterResponse;
import com.trainingplatform.chapter.entity.Chapter;
import com.trainingplatform.chapter.mapper.ChapterMapper;
import com.trainingplatform.chapter.repository.ChapterRepository;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.course.entity.Course;
import com.trainingplatform.course.enums.CourseStatus;
import com.trainingplatform.course.repository.CourseRepository;
import com.trainingplatform.enrollment.repository.EnrollmentRepository;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final ChapterMapper chapterMapper;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public ChapterResponse createChapter(
            Authentication authentication,
            CreateChapterRequest request
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to add chapters to this course."
            );
        }

        if (chapterRepository.existsByCourseAndPosition(
                course,
                request.getPosition()
        )) {
            throw new IllegalArgumentException(
                    "A chapter with position "
                            + request.getPosition()
                            + " already exists."
            );
        }

        Chapter chapter = Chapter.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .position(request.getPosition())
                .course(course)
                .build();

        chapterRepository.save(chapter);

        return chapterMapper.toResponse(chapter);
    }


    @Transactional(readOnly = true)
    public List<ChapterResponse> getCourseChapters(
            Authentication authentication,
            Long courseId
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to access this course."
            );
        }

        return chapterRepository.findByCourseOrderByPositionAsc(course)
                .stream()
                .map(chapterMapper::toResponse)
                .toList();
    }

    @Transactional
    public ChapterResponse updateChapter(
            Authentication authentication,
            Long id,
            UpdateChapterRequest request
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter not found.")
                );

        Course course = chapter.getCourse();

        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to update this chapter."
            );
        }

        if (!chapter.getPosition().equals(request.getPosition())
                && chapterRepository.existsByCourseAndPosition(
                course,
                request.getPosition()
        )) {

            throw new IllegalArgumentException(
                    "A chapter with position "
                            + request.getPosition()
                            + " already exists."
            );
        }

        chapter.setTitle(request.getTitle());
        chapter.setDescription(request.getDescription());
        chapter.setPosition(request.getPosition());

        chapterRepository.save(chapter);

        return chapterMapper.toResponse(chapter);
    }

    @Transactional
    public void deleteChapter(
            Authentication authentication,
            Long id
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter not found.")
                );

        if (!chapter.getCourse().getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to delete this chapter."
            );
        }

        chapterRepository.delete(chapter);
    }
    @Transactional(readOnly = true)
    public List<ChapterResponse> getLearnerCourseChapters(
            Authentication authentication,
            Long courseId
    ) {

        User learner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw new IllegalStateException(
                    "This course is not available."
            );
        }

        if (!enrollmentRepository.existsByLearnerAndCourse(
                learner,
                course
        )) {
            throw new IllegalStateException(
                    "You are not enrolled in this course."
            );
        }

        return chapterRepository
                .findByCourseOrderByPositionAsc(course)
                .stream()
                .map(chapterMapper::toResponse)
                .toList();
    }
}