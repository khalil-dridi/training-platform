import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { EnrollmentResponse } from '../../trainer/pages/models/enrollment-response.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/enrollments`;

  getEnrollment(courseId: number) {
    return this.http.get<ApiResponse<EnrollmentResponse>>(
      `${this.apiUrl}/${courseId}`
    );
  }

  enroll(courseId: number) {
    return this.http.post<ApiResponse<EnrollmentResponse>>(
      `${this.apiUrl}/${courseId}`,
      {}
    );
  }

  getMyCourses() {
    return this.http.get<ApiResponse<EnrollmentResponse[]>>(
      `${this.apiUrl}/my-courses`
    );
  }
}
