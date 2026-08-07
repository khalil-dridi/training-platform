package com.trainingplatform.chapter.repository;

import com.trainingplatform.chapter.entity.Chapter;
import com.trainingplatform.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findByCourseOrderByPositionAsc(Course course);
    boolean existsByCourseAndPosition(
            Course course,
            Integer position
    );

}