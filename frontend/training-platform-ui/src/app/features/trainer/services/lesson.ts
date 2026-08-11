import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment.development';

import { LessonResponse } from '../pages/models/lesson-response.model';
import { CreateLessonRequest } from '../pages/models/create-lesson-request.model';
import { UpdateLessonRequest } from '../pages/models/update-lesson-request.model';

@Injectable({
  providedIn: 'root',
})
export class LessonService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/lessons`;

  getChapterLessons(chapterId: number) {
    return this.http.get<ApiResponse<LessonResponse[]>>(
      `${this.apiUrl}/chapter/${chapterId}`
    );
  }

  createLesson(
    request: CreateLessonRequest,
    video: File
  ) {
    const formData = new FormData();

    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('chapterId', request.chapterId.toString());
    formData.append('duration', request.duration.toString());
    formData.append('preview', request.preview.toString());
    formData.append('position', request.position.toString());
    formData.append('video', video);

    return this.http.post<ApiResponse<LessonResponse>>(
      this.apiUrl,
      formData
    );
  }

  updateLesson(
    id: number,
    request: UpdateLessonRequest,
    video?: File
  ) {
    const formData = new FormData();

    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('duration', request.duration.toString());
    formData.append('preview', request.preview.toString());
    formData.append('position', request.position.toString());

    if (video) {
      formData.append('video', video);
    }

    return this.http.put<ApiResponse<LessonResponse>>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }
  deleteLesson(id: number) {
  return this.http.delete<ApiResponse<void>>(
    `${this.apiUrl}/${id}`
  );
}
}