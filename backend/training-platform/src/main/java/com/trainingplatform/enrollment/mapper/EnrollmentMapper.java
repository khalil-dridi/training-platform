package com.trainingplatform.enrollment.mapper;

import com.trainingplatform.enrollment.dto.response.EnrollmentResponse;
import com.trainingplatform.enrollment.entity.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

    @Mapping(target = "learnerId", source = "learner.id")
    @Mapping(target = "learnerName",
            expression = "java(enrollment.getLearner().getFirstName() + \" \" + enrollment.getLearner().getLastName())")
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseTitle", source = "course.title")
    EnrollmentResponse toResponse(Enrollment enrollment);

}