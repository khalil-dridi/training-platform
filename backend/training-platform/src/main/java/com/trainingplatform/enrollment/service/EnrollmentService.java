package com.trainingplatform.enrollment.service;

import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.course.entity.Course;
import com.trainingplatform.course.enums.CourseStatus;
import com.trainingplatform.course.repository.CourseRepository;
import com.trainingplatform.enrollment.dto.response.EnrollmentResponse;
import com.trainingplatform.enrollment.dto.response.StudentCourseResponse;
import com.trainingplatform.enrollment.dto.response.StudentEnrollmentResponse;
import com.trainingplatform.enrollment.dto.response.TrainerStudentResponse;
import com.trainingplatform.enrollment.dto.resquest.UpdateProgressRequest;
import com.trainingplatform.enrollment.entity.Enrollment;
import com.trainingplatform.enrollment.mapper.EnrollmentMapper;
import com.trainingplatform.enrollment.repository.EnrollmentRepository;
import com.trainingplatform.user.dto.response.UserResponse;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

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

    @Transactional(readOnly = true)
    public StudentEnrollmentResponse getStudentEnrollment(
            Authentication authentication,
            Long courseId,
            Long learnerId
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found.")
                );

        // Vérifier que le course appartient bien au trainer connecté
        if (!course.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalStateException(
                    "You are not allowed to access this course."
            );
        }

        User learner = userRepository.findById(learnerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Learner not found.")
                );

        Enrollment enrollment = enrollmentRepository
                .findByLearnerAndCourse(learner, course)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student is not enrolled in this course."
                        )
                );

        return StudentEnrollmentResponse.builder()
                .learnerId(learner.getId())
                .learnerName(
                        learner.getFirstName() + " " + learner.getLastName()
                )
                .learnerEmail(learner.getEmail())
                .avatarUrl(learner.getAvatarUrl())
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .progress(enrollment.getProgress())
                .completed(enrollment.getCompleted())
                .enrolledAt(enrollment.getEnrolledAt())
                .completedAt(enrollment.getCompletedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TrainerStudentResponse> getMyStudents(
            Authentication authentication
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        List<Enrollment> enrollments =
                enrollmentRepository.findAllByTrainer(trainer);

        return enrollments.stream()
                .collect(Collectors.groupingBy(
                        enrollment -> enrollment.getLearner().getId(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ))
                .values()
                .stream()
                .map(studentEnrollments -> {

                    User learner =
                            studentEnrollments.get(0).getLearner();

                    List<StudentCourseResponse> courses =
                            studentEnrollments.stream()
                                    .map(enrollment ->
                                            StudentCourseResponse.builder()
                                                    .enrollmentId(
                                                            enrollment.getId()
                                                    )
                                                    .courseId(
                                                            enrollment.getCourse().getId()
                                                    )
                                                    .courseTitle(
                                                            enrollment.getCourse().getTitle()
                                                    )
                                                    .progress(
                                                            enrollment.getProgress()
                                                    )
                                                    .completed(
                                                            enrollment.getCompleted()
                                                    )
                                                    .enrolledAt(
                                                            enrollment.getEnrolledAt()
                                                    )
                                                    .completedAt(
                                                            enrollment.getCompletedAt()
                                                    )
                                                    .build()
                                    )
                                    .toList();

                    return TrainerStudentResponse.builder()
                            .learnerId(learner.getId())
                            .learnerName(
                                    learner.getFirstName()
                                            + " "
                                            + learner.getLastName()
                            )
                            .learnerEmail(learner.getEmail())
                            .avatarUrl(learner.getAvatarUrl())
                            .courses(courses)
                            .build();
                })
                .toList();
    }

}