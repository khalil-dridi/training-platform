package com.trainingplatform.dashboard.dto.response;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrainerDashboardResponse {

    private Long totalCourses;

    private Long publishedCourses;

    private Long draftCourses;

    private Long totalChapters;

    private Long totalLessons;

    private Long totalStudents;

}