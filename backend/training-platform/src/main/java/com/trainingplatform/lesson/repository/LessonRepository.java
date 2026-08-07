package com.trainingplatform.lesson.repository;

import com.trainingplatform.chapter.entity.Chapter;
import com.trainingplatform.lesson.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByChapterOrderByPositionAsc(Chapter chapter);

    boolean existsByChapterAndPosition(
            Chapter chapter,
            Integer position
    );

}