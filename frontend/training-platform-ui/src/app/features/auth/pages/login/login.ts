import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth-service';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../../user/services/user.service';
import { CurrentUserService } from '../../../../core/services/current-user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly router = inject(Router);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const request = this.loginForm.getRawValue();

    this.authService.login(request).subscribe({
      next: (response) => {

        this.tokenService.saveToken(response.data.accessToken);

        this.userService.getCurrentUser().subscribe({
          next: (response) => {

            const user = response.data;

            this.currentUserService.setUser(user);

            switch (user.role) {
              case 'ADMIN':
                this.router.navigate(['/admin/dashboard']);
                break;

              case 'TRAINER':
                this.router.navigate(['/trainer/dashboard']);
                break;

              case 'LEARNER':
                this.router.navigate(['/learner/dashboard']);
                break;

              default:
                this.router.navigate(['/login']);
            }

          },
          error: (error) => {
            console.error('Failed to load current user', error);
          },
        });

      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }

  loginWithGoogle(): void {
    window.location.href =
      'http://localhost:8080/oauth2/authorization/google';
  }

}