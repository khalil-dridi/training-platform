import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../../../../shared/notifications/notification.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  template: `<p>Vérification de votre compte...</p>`,
  styleUrl: './verify-email.scss'
})
export class VerifyEmail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.notificationService.error('Lien de vérification invalide.');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (response) => {

        this.notificationService.success(response.message);

        this.router.navigate(['/login']);
      },
      error: (error) => {

        this.notificationService.errorFromHttp(
          error,
          'La vérification du compte a échoué.'
        );

        this.router.navigate(['/login']);
      }
    });

  }

}