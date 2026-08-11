package com.trainingplatform.enrollment.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TrainerStudentResponse {

    private Long learnerId;

    private String learnerName;

    private String learnerEmail;

    private String avatarUrl;

    private List<StudentCourseResponse> courses;
}