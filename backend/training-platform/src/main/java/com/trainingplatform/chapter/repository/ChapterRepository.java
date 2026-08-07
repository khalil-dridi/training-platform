package com.trainingplatform.chapter.repository;

import com.trainingplatform.chapter.entity.Chapter;
import com.trainingplatform.course.entity.Course;
import com.trainingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findByCourseOrderByPositionAsc(Course course);
    boolean existsByCourseAndPosition(
            Course course,
            Integer position
    );

    @Query("""
    SELECT COUNT(c)
    FROM Chapter c
    WHERE c.course.trainer = :trainer
""")
    long countByTrainer(@Param("trainer") User trainer);

}