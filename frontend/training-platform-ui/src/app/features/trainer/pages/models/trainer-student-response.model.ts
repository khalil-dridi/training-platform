export interface TrainerStudentResponse {
  learnerId: number;

  learnerName: string;

  learnerEmail: string;

  avatarUrl: string | null;

  courses: StudentCourseResponse[];
}

export interface StudentCourseResponse {
  enrollmentId: number;

  courseId: number;

  courseTitle: string;

  progress: number;

  completed: boolean;

  enrolledAt: string;

  completedAt: string | null;
}