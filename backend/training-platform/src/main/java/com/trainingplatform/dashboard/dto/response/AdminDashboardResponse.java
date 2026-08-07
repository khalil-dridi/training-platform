package com.trainingplatform.dashboard.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long totalLearners;

    private Long totalTrainers;

    private Long totalAdmins;

    private Long totalCategories;

    private Long totalCourses;

    private Long publishedCourses;

    private Long draftCourses;

    private Long totalEnrollments;

    private Long pendingInstructorRequests;

    private Long approvedInstructorRequests;

    private Long rejectedInstructorRequests;

}