export interface StudentEnrollmentResponse {
  learnerId: number;
  learnerName: string;
  learnerEmail: string;
  avatarUrl: string | null;

  courseId: number;
  courseTitle: string;

  progress: number;
  completed: boolean;

  enrolledAt: string;
  completedAt: string | null;
}