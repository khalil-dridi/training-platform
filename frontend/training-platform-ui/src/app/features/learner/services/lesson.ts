import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { LessonResponse } from '../../trainer/pages/models/lesson-response.model';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/lessons`;

  getLearnerChapterLessons(chapterId: number) {
    return this.http.get<ApiResponse<LessonResponse[]>>(
      `${this.apiUrl}/learner/chapter/${chapterId}`
    );
  }
}
