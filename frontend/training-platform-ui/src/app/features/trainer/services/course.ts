import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment.development';

import { CreateCourseRequest } from '../pages/models/create-course-request.model';
import { CourseResponse } from '../pages/models/course-response.model';
import { UpdateCourseRequest } from '../pages/models/update-course-request.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/courses`;

  getMyCourses() {
    return this.http.get<ApiResponse<CourseResponse[]>>(
      `${this.apiUrl}/me`
    );
  }

  getMyCourseById(id: number) {
    return this.http.get<ApiResponse<CourseResponse>>(
      `${this.apiUrl}/me/${id}`
    );
  }

  createCourse(
    request: CreateCourseRequest,
    thumbnail: File
  ) {
    const formData = new FormData();

    formData.append('title', request.title);
    formData.append('shortDescription', request.shortDescription);
    formData.append('description', request.description);
    formData.append('price', request.price.toString());
    formData.append('level', request.level);
    formData.append('language', request.language);
    formData.append('categoryId', request.categoryId.toString());
    formData.append('thumbnail', thumbnail);

    return this.http.post<ApiResponse<CourseResponse>>(
      this.apiUrl,
      formData
    );
  }

  updateCourse(
    id: number,
    request: UpdateCourseRequest,
    thumbnail?: File
  ) {
    const formData = new FormData();

    formData.append('title', request.title);
    formData.append('shortDescription', request.shortDescription);
    formData.append('description', request.description);
    formData.append('price', request.price.toString());
    formData.append('level', request.level);
    formData.append('language', request.language);
    formData.append('categoryId', request.categoryId.toString());

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    return this.http.put<ApiResponse<CourseResponse>>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }
  deleteCourse(id: number) {
  return this.http.delete<ApiResponse<void>>(
    `${this.apiUrl}/${id}`
  );
}
publishCourse(id: number) {
  return this.http.patch<ApiResponse<CourseResponse>>(
    `${this.apiUrl}/${id}/publish`,
    {}
  );
}
}