import { CourseLevel } from './course-level.model';
import { CourseStatus } from './course-status.model';

export interface CourseResponse {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string | null;
  price: number;
  level: CourseLevel;
  language: string;
  status: CourseStatus;
  categoryId: number;
  categoryName: string;
  trainerId: number;
  trainerName: string;
  createdAt: string;
  updatedAt: string;
}