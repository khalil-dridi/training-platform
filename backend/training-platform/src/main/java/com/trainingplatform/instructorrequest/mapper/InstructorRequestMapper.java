package com.trainingplatform.instructorrequest.mapper;

import com.trainingplatform.instructorrequest.dto.response.InstructorRequestResponse;
import com.trainingplatform.instructorrequest.entity.InstructorRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InstructorRequestMapper {

    InstructorRequestResponse toResponse(InstructorRequest instructorRequest);

}
