package com.trainingplatform.lesson.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LessonResponse {

    private Long id;

    private String title;

    private String description;

    private String videoUrl;

    private Integer duration;

    private Boolean preview;

    private Integer position;

    private Long chapterId;

    private String chapterTitle;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}