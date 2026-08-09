export interface AdminDashboardResponse {
  totalUsers: number;
  totalLearners: number;
  totalTrainers: number;
  totalAdmins: number;
  totalCategories: number;
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  pendingInstructorRequests: number;
  approvedInstructorRequests: number;
  rejectedInstructorRequests: number;
}