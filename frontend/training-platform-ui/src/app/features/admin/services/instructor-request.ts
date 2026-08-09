import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  InstructorRequestResponse,
  InstructorRequestStatus,
} from '../models/instructor-request-response.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorRequestService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/instructor-requests`;

  getAllRequests(
    status?: InstructorRequestStatus,
    page = 0,
    size = 10
  ) {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<
      ApiResponse<PageResponse<InstructorRequestResponse>>
    >(
      `${this.apiUrl}/admin`,
      { params }
    );
  }

  approveRequest(id: number) {
    return this.http.patch<ApiResponse<InstructorRequestResponse>>(
      `${this.apiUrl}/admin/${id}/approve`,
      {}
    );
  }

  rejectRequest(id: number) {
    return this.http.patch<ApiResponse<InstructorRequestResponse>>(
      `${this.apiUrl}/admin/${id}/reject`,
      {}
    );
  }
}