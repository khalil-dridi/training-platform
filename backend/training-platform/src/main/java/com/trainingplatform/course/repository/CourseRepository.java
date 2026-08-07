package com.trainingplatform.course.repository;

import com.trainingplatform.course.entity.Course;
import com.trainingplatform.course.enums.CourseStatus;
import com.trainingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTrainer(User trainer);

    List<Course> findByStatus(CourseStatus status);


    List<Course> findByCategoryIdAndStatus(
            Long categoryId,
            CourseStatus status
    );
}