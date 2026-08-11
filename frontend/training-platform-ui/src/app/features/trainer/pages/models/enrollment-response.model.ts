export interface EnrollmentResponse {
  id: number;

  learnerId: number;
  learnerName: string;

  courseId: number;
  courseTitle: string;

  progress: number;

  completed: boolean;

  enrolledAt: string;

  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}