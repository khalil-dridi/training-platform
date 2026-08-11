import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { ChapterResponse } from '../../trainer/pages/models/chapter-response.model';

@Injectable({
  providedIn: 'root',
})
export class ChapterService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/chapters`;

  getLearnerCourseChapters(courseId: number) {
    return this.http.get<ApiResponse<ChapterResponse[]>>(
      `${this.apiUrl}/learner/course/${courseId}`
    );
  }
}
