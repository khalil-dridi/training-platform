package com.trainingplatform.enrollment.repository;

import com.trainingplatform.course.entity.Course;
import com.trainingplatform.enrollment.entity.Enrollment;
import com.trainingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByLearnerAndCourse(
            User learner,
            Course course
    );

    Optional<Enrollment> findByLearnerAndCourse(
            User learner,
            Course course
    );

    List<Enrollment> findByLearner(User learner);

    List<Enrollment> findByCourse(Course course);

    @Query("""
    SELECT COUNT(e)
    FROM Enrollment e
    WHERE e.course.trainer = :trainer
""")
    long countByTrainer(@Param("trainer") User trainer);

    long countByLearner(User learner);

    long countByLearnerAndCompleted(
            User learner,
            Boolean completed
    );

    @Query("""
    SELECT COALESCE(AVG(e.progress), 0)
    FROM Enrollment e
    WHERE e.learner = :learner
""")
    Double averageProgressByLearner(
            @Param("learner") User learner
    );
    Optional<Enrollment> findByCourseAndLearner(
            Course course,
            User learner
    );

    @Query("""
    SELECT DISTINCT e.learner
    FROM Enrollment e
    WHERE e.course.trainer = :trainer
""")
    List<User> findDistinctLearnersByTrainer(
            @Param("trainer") User trainer
    );

    @Query("""
    SELECT e
    FROM Enrollment e
    WHERE e.course.trainer = :trainer
    ORDER BY e.learner.id, e.course.id
""")
    List<Enrollment> findAllByTrainer(
            @Param("trainer") User trainer
    );

}
