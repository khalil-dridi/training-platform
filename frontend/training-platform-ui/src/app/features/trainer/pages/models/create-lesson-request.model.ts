export interface CreateLessonRequest {
  title: string;
  description: string;
  chapterId: number;
  duration: number;
  preview: boolean;
  position: number;
}