package com.trainingplatform.progress.repository;

import com.trainingplatform.lesson.entity.Lesson;
import com.trainingplatform.lesson.repository.LessonRepository;
import com.trainingplatform.progress.entity.LessonProgress;
import com.trainingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository
        extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByLearnerAndLesson(
            User learner,
            Lesson lesson
    );

    List<LessonProgress> findByLearner(User learner);

    List<LessonProgress> findByLearnerAndLessonChapterCourseId(
            User learner,
            Long courseId
    );

    long countByLearnerAndLessonChapterCourseIdAndCompletedTrue(
            User learner,
            Long courseId
    );
}