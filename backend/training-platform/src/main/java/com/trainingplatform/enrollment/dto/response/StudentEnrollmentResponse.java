package com.trainingplatform.enrollment.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StudentEnrollmentResponse {

    private Long learnerId;

    private String learnerName;

    private String learnerEmail;

    private String avatarUrl;

    private Long courseId;

    private String courseTitle;

    private Integer progress;

    private Boolean completed;

    private LocalDateTime enrolledAt;

    private LocalDateTime completedAt;
}