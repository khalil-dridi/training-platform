package com.trainingplatform.progress.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LessonProgressResponse {

    private Long id;

    private Long learnerId;

    private Long lessonId;

    private String lessonTitle;

    private Long courseId;

    private Boolean completed;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}