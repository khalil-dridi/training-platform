import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';

import { ChapterResponse } from '../pages/models/chapter-response.model';
import { CreateChapterRequest } from '../pages/models/create-chapter-request.model';
import { UpdateChapterRequest } from '../pages/models/update-chapter-request.model';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/chapters`;

  getCourseChapters(courseId: number) {
    return this.http.get<ApiResponse<ChapterResponse[]>>(
      `${this.apiUrl}/course/${courseId}`
    );
  }

  createChapter(request: CreateChapterRequest) {
    return this.http.post<ApiResponse<ChapterResponse>>(
      this.apiUrl,
      request
    );
  }
  updateChapter(
  id: number,
  request: UpdateChapterRequest
) {
  return this.http.put<ApiResponse<ChapterResponse>>(
    `${this.apiUrl}/${id}`,
    request
  );
}
deleteChapter(id: number) {
  return this.http.delete<ApiResponse<void>>(
    `${this.apiUrl}/${id}`
  );
}
}