package com.trainingplatform.chapter.mapper;

import com.trainingplatform.chapter.dto.response.ChapterResponse;
import com.trainingplatform.chapter.entity.Chapter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChapterMapper {

    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseTitle", source = "course.title")
    ChapterResponse toResponse(Chapter chapter);

}