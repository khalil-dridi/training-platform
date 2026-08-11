import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { TrainerDashboardResponse } from '../pages/models/trainer-dashboard-response.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getTrainerDashboard() {
    return this.http.get<ApiResponse<TrainerDashboardResponse>>(
      `${this.apiUrl}/trainer`
    );
  }
}