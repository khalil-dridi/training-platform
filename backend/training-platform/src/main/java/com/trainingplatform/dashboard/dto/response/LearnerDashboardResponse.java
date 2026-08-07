package com.trainingplatform.dashboard.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LearnerDashboardResponse {

    private Long enrolledCourses;

    private Long completedCourses;

    private Long inProgressCourses;

    private Integer overallProgress;

}