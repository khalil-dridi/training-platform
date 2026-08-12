import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment.development';
import { RecommendationResponse } from '../models/recommendation.model';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/recommendations`;

  getRecommendations(
    learnerId: number,
    topN: number = 5
  ): Observable<RecommendationResponse> {
    const params = new HttpParams().set('topN', topN.toString());

    return this.http.get<RecommendationResponse>(`${this.apiUrl}/${learnerId}`, {
      params,
    });
  }
}
