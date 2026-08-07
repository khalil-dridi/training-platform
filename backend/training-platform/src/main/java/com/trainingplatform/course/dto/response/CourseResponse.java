package com.trainingplatform.course.dto.response;

import com.trainingplatform.course.enums.CourseLevel;
import com.trainingplatform.course.enums.CourseStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CourseResponse {

    private Long id;

    private String title;

    private String shortDescription;

    private String description;

    private String thumbnailUrl;

    private BigDecimal price;

    private CourseLevel level;

    private String language;

    private CourseStatus status;

    private Long categoryId;

    private String categoryName;

    private Long trainerId;

    private String trainerName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}