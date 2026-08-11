export interface LessonProgressResponse {
  id: number;

  learnerId: number;

  lessonId: number;

  lessonTitle: string;

  courseId: number;

  completed: boolean;

  completedAt: string | null;

  createdAt: string;

  updatedAt: string;
}