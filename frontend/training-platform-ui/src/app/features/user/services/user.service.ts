import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';

import { UserResponse } from '../models/user-response.model';
import { UpdateProfileRequest } from '../../admin/models/update-profile-request.model';
import { ChangePasswordRequest } from '../../admin/models/change-password-request.model';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/users`;

  getCurrentUser() {
    return this.http.get<ApiResponse<UserResponse>>(
      `${this.apiUrl}/me`
    );
  }

  updateProfile(request: UpdateProfileRequest) {
    return this.http.put<ApiResponse<UserResponse>>(
      `${this.apiUrl}/me`,
      request
    );
  }

  changePassword(request: ChangePasswordRequest) {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/change-password`,
      request
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<ApiResponse<UserResponse>>(
      `${this.apiUrl}/avatar`,
      formData
    );
  }

  deleteAvatar() {
    return this.http.delete<ApiResponse<UserResponse>>(
      `${this.apiUrl}/avatar`
    );
  }
}