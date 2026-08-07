package com.trainingplatform.enrollment.service;

import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.course.entity.Course;
import com.trainingplatform.course.enums.CourseStatus;
import com.trainingplatform.course.repository.CourseRepository;
import com.trainingplatform.enrollment.dto.response.EnrollmentResponse;
import com.trainingplatform.enrollment.dto.resquest.UpdateProgressRequest;
import com.trainingplatform.enrollment.entity.Enrollment;
import com.trainingplatform.enrollment.mapper.EnrollmentMapper;
import com.trainingplatform.enrollment.repository.EnrollmentRepository;
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
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public EnrollmentResponse enroll(
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

        if (enrollmentRepository.existsByLearnerAndCourse(
                learner,
                course
        )) {
            throw new IllegalStateException(
                    "You are already enrolled in this course."
            );
        }

        Enrollment enrollment = Enrollment.builder()
                .learner(learner)
                .course(course)
                .progress(0)
                .completed(false)
                .enrolledAt(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);

        return enrollmentMapper.toResponse(enrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getMyCourses(
            Authentication authentication
    ) {

        User learner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        return enrollmentRepository.findByLearner(learner)
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getCourseEnrollments(
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

        return enrollmentRepository.findByCourse(course)
                .stream()
                .map(enrollmentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EnrollmentResponse getEnrollment(
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

        Enrollment enrollment = enrollmentRepository
                .findByLearnerAndCourse(learner, course)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Enrollment not found.")
                );

        return enrollmentMapper.toResponse(enrollment);
    }

    @Transactional
    public EnrollmentResponse updateProgress(
            Authentication authentication,
            Long courseId,
            UpdateProgressRequest request
    ) {

        User learner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        Enrollment enrollment = enrollmentRepository
                .findByLearnerAndCourse(learner, course)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Enrollment not found.")
                );

        enrollment.setProgress(request.getProgress());

        if (request.getProgress() == 100) {
            enrollment.setCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
        } else {
            enrollment.setCompleted(false);
            enrollment.setCompletedAt(null);
        }

        enrollmentRepository.save(enrollment);

        return enrollmentMapper.toResponse(enrollment);
    }

}