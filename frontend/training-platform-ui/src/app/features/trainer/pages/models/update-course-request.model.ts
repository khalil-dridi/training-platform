import { CourseLevel } from './course-level.model';

export interface UpdateCourseRequest {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  level: CourseLevel;
  language: string;
  categoryId: number;
}