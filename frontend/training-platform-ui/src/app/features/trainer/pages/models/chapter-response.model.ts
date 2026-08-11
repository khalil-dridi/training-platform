export interface ChapterResponse {
  id: number;
  title: string;
  description: string | null;
  position: number;
  courseId: number;
  courseTitle: string;
  createdAt: string;
  updatedAt: string;
}