package com.trainingplatform.course.mapper;

import com.trainingplatform.course.dto.response.CourseResponse;
import com.trainingplatform.course.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "trainerId", source = "trainer.id")
    @Mapping(
            target = "trainerName",
            expression = "java(course.getTrainer().getFirstName() + \" \" + course.getTrainer().getLastName())"
    )
    CourseResponse toResponse(Course course);

}
