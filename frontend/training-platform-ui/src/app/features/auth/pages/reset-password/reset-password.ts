import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { NotificationService } from '../../../../shared/notifications/notification.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly resetPasswordForm = this.fb.nonNullable.group({
    token: [''],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.resetPasswordForm.patchValue({ token });
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const request = this.resetPasswordForm.getRawValue();

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.notification
          .success('Votre mot de passe a été réinitialisé avec succès.', 3000)
          .afterDismissed()
          .subscribe(() => {
            void this.router.navigate(['/login']);
          });
      },
      error: (error: unknown) => {
        this.notification.errorFromHttp(
          error,
          'Impossible de réinitialiser le mot de passe.'
        );
      },
    });
  }
}
