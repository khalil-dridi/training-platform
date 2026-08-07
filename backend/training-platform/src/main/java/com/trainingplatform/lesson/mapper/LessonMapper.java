package com.trainingplatform.lesson.mapper;


import com.trainingplatform.lesson.dto.response.LessonResponse;
import com.trainingplatform.lesson.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "chapterId", source = "chapter.id")
    @Mapping(target = "chapterTitle", source = "chapter.title")
    LessonResponse toResponse(Lesson lesson);

}