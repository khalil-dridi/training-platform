package com.trainingplatform.progress.service;


import com.trainingplatform.common.exception.ResourceNotFoundException;

import com.trainingplatform.course.entity.Course;
import com.trainingplatform.course.repository.CourseRepository;
import com.trainingplatform.enrollment.entity.Enrollment;
import com.trainingplatform.enrollment.repository.EnrollmentRepository;
import com.trainingplatform.lesson.entity.Lesson;
import com.trainingplatform.lesson.repository.LessonRepository;
import com.trainingplatform.progress.dto.response.LessonProgressResponse;
import com.trainingplatform.progress.entity.LessonProgress;
import com.trainingplatform.progress.repository.LessonProgressRepository;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    @Transactional
    public LessonProgressResponse completeLesson(
            Authentication authentication,
            Long lessonId
    ) {

        User learner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lesson not found.")
                );

        Enrollment enrollment = enrollmentRepository
                .findByLearnerAndCourse(
                        learner,
                        lesson.getChapter().getCourse()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "You are not enrolled in this course."
                        )
                );

        LessonProgress progress = lessonProgressRepository
                .findByLearnerAndLesson(learner, lesson)
                .orElseGet(() ->
                        LessonProgress.builder()
                                .learner(learner)
                                .lesson(lesson)
                                .completed(false)
                                .build()
                );

        if (!progress.getCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
        }

        lessonProgressRepository.save(progress);

        // Calculate course progress
        Long courseId = lesson.getChapter().getCourse().getId();

        long totalLessons =
                lessonRepository.countByChapterCourseId(courseId);

        long completedLessons =
                lessonProgressRepository
                        .countByLearnerAndLessonChapterCourseIdAndCompletedTrue(
                                learner,
                                courseId
                        );

        int courseProgress = totalLessons == 0
                ? 0
                : (int) Math.round(
                (completedLessons * 100.0) / totalLessons
        );

        enrollment.setProgress(courseProgress);

        if (courseProgress == 100) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
        } else {
            enrollment.setCompleted(false);
            enrollment.setCompletedAt(null);
        }

        enrollmentRepository.save(enrollment);

        return LessonProgressResponse.builder()
                .id(progress.getId())
                .learnerId(learner.getId())
                .lessonId(lesson.getId())
                .lessonTitle(lesson.getTitle())
                .courseId(courseId)
                .completed(progress.getCompleted())
                .completedAt(progress.getCompletedAt())
                .createdAt(progress.getCreatedAt())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }

    @Transactional
    public LessonProgressResponse uncompleteLesson(
            Authentication authentication,
            Long lessonId
    ) {

        User learner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lesson not found.")
                );

        Enrollment enrollment = enrollmentRepository
                .findByLearnerAndCourse(
                        learner,
                        lesson.getChapter().getCourse()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "You are not enrolled in this course."
                        )
                );

        LessonProgress progress = lessonProgressRepository
                .findByLearnerAndLesson(learner, lesson)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lesson progress not found."
                        )
                );

        progress.setCompleted(false);
        progress.setCompletedAt(null);

        lessonProgressRepository.save(progress);

        // Recalculate course progress
        Long courseId = lesson.getChapter().getCourse().getId();

        long totalLessons =
                lessonRepository.countByChapterCourseId(courseId);

        long completedLessons =
                lessonProgressRepository
                        .countByLearnerAndLessonChapterCourseIdAndCompletedTrue(
                                learner,
                                courseId
                        );

        int courseProgress = totalLessons == 0
                ? 0
                : (int) Math.round(
                (completedLessons * 100.0) / totalLessons
        );

        enrollment.setProgress(courseProgress);

        if (courseProgress == 100) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
        } else {
            enrollment.setCompleted(false);
            enrollment.setCompletedAt(null);
        }

        enrollmentRepository.save(enrollment);

        return LessonProgressResponse.builder()
                .id(progress.getId())
                .learnerId(learner.getId())
                .lessonId(lesson.getId())
                .lessonTitle(lesson.getTitle())
                .courseId(courseId)
                .completed(progress.getCompleted())
                .completedAt(progress.getCompletedAt())
                .createdAt(progress.getCreatedAt())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<LessonProgressResponse> getCourseProgress(
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

        enrollmentRepository
                .findByLearnerAndCourse(learner, course)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "You are not enrolled in this course."
                        )
                );

        return lessonProgressRepository
                .findByLearnerAndLessonChapterCourseId(
                        learner,
                        courseId
                )
                .stream()
                .map(progress -> {

                    Lesson lesson = progress.getLesson();

                    return LessonProgressResponse.builder()
                            .id(progress.getId())
                            .learnerId(learner.getId())
                            .lessonId(lesson.getId())
                            .lessonTitle(lesson.getTitle())
                            .courseId(courseId)
                            .completed(progress.getCompleted())
                            .completedAt(progress.getCompletedAt())
                            .createdAt(progress.getCreatedAt())
                            .updatedAt(progress.getUpdatedAt())
                            .build();
                })
                .toList();
    }
}
