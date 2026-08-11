import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment.development';
import { LessonProgressResponse } from '../../trainer/pages/models/Lesson-Progress-Response';

@Injectable({
  providedIn: 'root',
})
export class LessonProgressService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/lesson-progress`;

  getCourseProgress(courseId: number) {
    return this.http.get<
      ApiResponse<LessonProgressResponse[]>
    >(
      `${this.apiUrl}/course/${courseId}`
    );
  }

  completeLesson(lessonId: number) {
    return this.http.patch<
      ApiResponse<LessonProgressResponse>
    >(
      `${this.apiUrl}/${lessonId}/complete`,
      {}
    );
  }

  uncompleteLesson(lessonId: number) {
    return this.http.patch<
      ApiResponse<LessonProgressResponse>
    >(
      `${this.apiUrl}/${lessonId}/uncomplete`,
      {}
    );
  }
}