import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { UserResponse } from '../../user/models/user-response.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/users`;

  getAllUsers(search?: string, page = 0, size = 10) {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (search) {
      params['search'] = search;
    }

    return this.http.get<ApiResponse<PageResponse<UserResponse>>>(
      this.apiUrl,
      { params }
    );
  }

  getUserById(id: number) {
    return this.http.get<ApiResponse<UserResponse>>(
      `${this.apiUrl}/${id}`
    );
  }
}