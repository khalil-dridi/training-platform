import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '../../../../shared/notifications/notification.service';
import { AuthService } from '../../services/auth-service';

type VerifyEmailMode = 'pending' | 'verifying' | 'success' | 'invalid';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);

  readonly mode = signal<VerifyEmailMode>('verifying');
  email = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token) {
      this.mode.set('verifying');
      this.verifyToken(token);
      return;
    }

    if (email) {
      this.email = email;
      this.mode.set('pending');
      return;
    }

    this.mode.set('invalid');
    this.notification.error('Lien de vérification invalide.');
  }

  private verifyToken(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.mode.set('success');
        this.notification.success(response.message);

        window.setTimeout(() => {
          void this.router.navigate(['/login']);
        }, 1200);
      },
      error: (error) => {
        this.mode.set('invalid');
        this.notification.errorFromHttp(error, 'La vérification du compte a échoué.');
      },
    });
  }
}
