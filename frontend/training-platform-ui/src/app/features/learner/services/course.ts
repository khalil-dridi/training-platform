import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CourseResponse } from '../../trainer/pages/models/course-response.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/courses`;

  getPublishedCourses() {
    return this.http.get<ApiResponse<CourseResponse[]>>(this.apiUrl);
  }

  getPublishedCourseById(id: number) {
    return this.http.get<ApiResponse<CourseResponse>>(`${this.apiUrl}/${id}`);
  }
}
