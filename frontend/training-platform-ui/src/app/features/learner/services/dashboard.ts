import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { LearnerDashboardResponse } from '../models/learner-dashboard-response.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getLearnerDashboard() {
    return this.http.get<ApiResponse<LearnerDashboardResponse>>(
      `${this.apiUrl}/learner`
    );
  }
}
