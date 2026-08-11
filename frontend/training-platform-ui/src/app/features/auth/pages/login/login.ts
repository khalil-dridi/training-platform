import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '../../../../shared/notifications/notification.service';
import { CurrentUserService } from '../../../../core/services/current-user';
import { UserService } from '../../../user/services/user.service';
import { AuthService } from '../../services/auth-service';
import { TokenService } from '../../services/token.service';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

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
    MatProgressSpinnerModule,
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
  private readonly notification = inject(NotificationService);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submitState: SubmitState = 'idle';
  passwordVisible = false;

  get isSubmitting(): boolean {
    return this.submitState === 'loading';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notification.warning(
        'Veuillez corriger les champs du formulaire avant de continuer.'
      );
      return;
    }

    const request = this.loginForm.getRawValue();
    this.submitState = 'loading';

    this.authService.login(request).subscribe({
      next: (response) => {
        this.tokenService.saveToken(response.data.accessToken);

        this.userService.getCurrentUser().subscribe({
          next: (userResponse) => {
            const user = userResponse.data;
            this.currentUserService.setUser(user);
            this.submitState = 'success';
            this.notification.success('Connexion réussie. Redirection en cours…', 2500);

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
          error: (error: unknown) => {
            this.submitState = 'error';
            this.notification.errorFromHttp(
              error,
              'Connexion établie, mais le profil utilisateur n’a pas pu être chargé.'
            );
            this.resetSubmitStateSoon();
          },
        });
      },
      error: (error: unknown) => {
        this.submitState = 'error';
        this.notification.error(this.resolveLoginErrorMessage(error));
        this.resetSubmitStateSoon();
      },
    });
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  private resolveLoginErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message;
      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
        return apiMessage;
      }

      if (error.status === 401 || error.status === 403) {
        return 'Email ou mot de passe incorrect. Vérifiez vos identifiants.';
      }

      if (error.status === 0) {
        return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      }
    }

    return 'La connexion a échoué. Veuillez réessayer.';
  }

  private resetSubmitStateSoon(): void {
    window.setTimeout(() => {
      if (this.submitState === 'error') {
        this.submitState = 'idle';
      }
    }, 1600);
  }
}
