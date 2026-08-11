import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment.development';
import { EnrollmentResponse } from '../pages/models/enrollment-response.model';
import { StudentEnrollmentResponse } from '../pages/models/student-enrollment-response.model';
import { UserResponse } from '../../user/models/user-response.model';
import { TrainerStudentResponse } from '../pages/models/trainer-student-response.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/enrollments`;

  getCourseEnrollments(courseId: number) {
    return this.http.get<ApiResponse<EnrollmentResponse[]>>(
      `${this.apiUrl}/course/${courseId}`
    );
  }
getStudentEnrollment(
  courseId: number,
  learnerId: number
) {
  return this.http.get<ApiResponse<StudentEnrollmentResponse>>(
    `${this.apiUrl}/course/${courseId}/student/${learnerId}`
  );
}
getMyStudents() {
  return this.http.get<ApiResponse<TrainerStudentResponse[]>>(
    `${this.apiUrl}/my-students`
  );
}
}