import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ApiResponse } from '../../../core/models/api-response.model';
import { LoginRequest } from '../models/login-request.model';
import { AuthenticationResponse } from '../models/authentication-response.model';
import { environment } from '../../../../environments/environment.development';
import { TokenService } from './token.service';
import { ForgotPasswordRequest } from '../models/forgot-password-request.model';
import { ResetPasswordRequest } from '../models/reset-password-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { UserResponse } from '../../user/models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  login(request: LoginRequest): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http.post<ApiResponse<AuthenticationResponse>>(
      `${this.apiUrl}/login`,
      request
    );
  }
  logout(): void {
  this.tokenService.removeToken();
}

forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<void>> {
  return this.http.post<ApiResponse<void>>(
    `${this.apiUrl}/forgot-password`,
    request
  );
}

resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<void>> {
  return this.http.post<ApiResponse<void>>(
    `${this.apiUrl}/reset-password`,
    request
  );
}

register(request: RegisterRequest): Observable<ApiResponse<UserResponse>> {
  return this.http.post<ApiResponse<UserResponse>>(
    `${this.apiUrl}/register`,
    request
  );
}

verifyEmail(token: string): Observable<ApiResponse<void>> {
  return this.http.get<ApiResponse<void>>(
    `${this.apiUrl}/verify?token=${token}`
  );
}

}