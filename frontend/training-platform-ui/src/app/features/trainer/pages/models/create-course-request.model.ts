import { CourseLevel } from './course-level.model';

export interface CreateCourseRequest {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  level: CourseLevel;
  language: string;
  categoryId: number;
}