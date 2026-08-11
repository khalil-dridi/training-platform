package com.trainingplatform.lesson.repository;

import com.trainingplatform.chapter.entity.Chapter;
import com.trainingplatform.lesson.entity.Lesson;
import com.trainingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByChapterOrderByPositionAsc(Chapter chapter);

    boolean existsByChapterAndPosition(
            Chapter chapter,
            Integer position
    );
    @Query("""
    SELECT COUNT(l)
    FROM Lesson l
    WHERE l.chapter.course.trainer = :trainer
""")
    long countByTrainer(@Param("trainer") User trainer);

    long countByChapterCourseId(Long courseId);

    long countByChapterCourseIdAndIdIn(
            Long courseId,
            List<Long> lessonIds
    );

}