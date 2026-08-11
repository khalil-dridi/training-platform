export interface LessonResponse {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  duration: number;
  preview: boolean;
  position: number;
  chapterId: number;
  chapterTitle: string;
  createdAt: string;
  updatedAt: string;
}