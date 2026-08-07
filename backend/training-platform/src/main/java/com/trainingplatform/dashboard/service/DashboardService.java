package com.trainingplatform.dashboard.service;

import com.trainingplatform.category.repository.CategoryRepository;
import com.trainingplatform.chapter.repository.ChapterRepository;
import com.trainingplatform.common.exception.ResourceNotFoundException;
import com.trainingplatform.course.enums.CourseStatus;
import com.trainingplatform.course.repository.CourseRepository;
import com.trainingplatform.dashboard.dto.response.AdminDashboardResponse;
import com.trainingplatform.dashboard.dto.response.LearnerDashboardResponse;
import com.trainingplatform.dashboard.dto.response.TrainerDashboardResponse;
import com.trainingplatform.enrollment.repository.EnrollmentRepository;
import com.trainingplatform.instructorrequest.enums.InstructorRequestStatus;
import com.trainingplatform.instructorrequest.repository.InstructorRequestRepository;
import com.trainingplatform.lesson.repository.LessonRepository;
import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.enums.Role;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final InstructorRequestRepository instructorRequestRepository;
    private final ChapterRepository chapterRepository ;
    private final LessonRepository lessonRepository;


    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {

        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalLearners(userRepository.countByRole(Role.LEARNER))
                .totalTrainers(userRepository.countByRole(Role.TRAINER))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                .totalCategories(categoryRepository.count())
                .totalCourses(courseRepository.count())
                .publishedCourses(courseRepository.countByStatus(CourseStatus.PUBLISHED))
                .draftCourses(courseRepository.countByStatus(CourseStatus.DRAFT))
                .totalEnrollments(enrollmentRepository.count())
                .pendingInstructorRequests(
                        instructorRequestRepository.countByStatus(
                                InstructorRequestStatus.PENDING
                        )
                )
                .approvedInstructorRequests(
                        instructorRequestRepository.countByStatus(
                                InstructorRequestStatus.APPROVED
                        )
                )
                .rejectedInstructorRequests(
                        instructorRequestRepository.countByStatus(
                                InstructorRequestStatus.REJECTED
                        )
                )
                .build();
    }

    @Transactional(readOnly = true)
    public TrainerDashboardResponse getTrainerDashboard(
            Authentication authentication
    ) {

        User trainer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        return TrainerDashboardResponse.builder()
                .totalCourses(
                        courseRepository.countByTrainer(trainer)
                )
                .publishedCourses(
                        courseRepository.countByTrainerAndStatus(
                                trainer,
                                CourseStatus.PUBLISHED
                        )
                )
                .draftCourses(
                        courseRepository.countByTrainerAndStatus(
                                trainer,
                                CourseStatus.DRAFT
                        )
                )
                .totalChapters(
                        chapterRepository.countByTrainer(trainer)
                )
                .totalLessons(
                        lessonRepository.countByTrainer(trainer)
                )
                .totalStudents(
                        enrollmentRepository.countByTrainer(trainer)
                )
                .build();
    }

    @Transactional(readOnly = true)
    public LearnerDashboardResponse getLearnerDashboard(
            Authentication authentication
    ) {

        User learner = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        long enrolledCourses =
                enrollmentRepository.countByLearner(learner);

        long completedCourses =
                enrollmentRepository.countByLearnerAndCompleted(
                        learner,
                        true
                );

        long inProgressCourses =
                enrolledCourses - completedCourses;

        Double average =
                enrollmentRepository.averageProgressByLearner(
                        learner
                );

        return LearnerDashboardResponse.builder()
                .enrolledCourses(enrolledCourses)
                .completedCourses(completedCourses)
                .inProgressCourses(inProgressCourses)
                .overallProgress(
                        average == null ? 0 : average.intValue()
                )
                .build();
    }

}
