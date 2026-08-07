package com.trainingplatform.chapter.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ChapterResponse {

    private Long id;

    private String title;

    private String description;

    private Integer position;

    private Long courseId;

    private String courseTitle;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
