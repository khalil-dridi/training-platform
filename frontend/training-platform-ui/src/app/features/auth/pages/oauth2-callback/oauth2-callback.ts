import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationService } from '../../../../shared/notifications/notification.service';
import { CurrentUserService } from '../../../../core/services/current-user';
import { UserService } from '../../../user/services/user.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  template: `<p>Connexion en cours...</p>`,
})
export class OAuth2Callback implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly notification = inject(NotificationService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.notification.error(
        'Authentification Google échouée. Veuillez réessayer.'
      );
      void this.router.navigate(['/login']);
      return;
    }

    this.tokenService.saveToken(token);

    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        const user = response.data;
        this.currentUserService.setUser(user);
        void this.redirectByRole(user.role);
      },
      error: (error: unknown) => {
        this.tokenService.removeToken();
        this.currentUserService.clear();
        this.notification.errorFromHttp(
          error,
          'Connexion Google réussie, mais le profil utilisateur n’a pas pu être chargé.'
        );
        void this.router.navigate(['/login']);
      },
    });
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        void this.router.navigate(['/admin/dashboard']);
        break;

      case 'TRAINER':
        void this.router.navigate(['/trainer/dashboard']);
        break;

      case 'LEARNER':
        void this.router.navigate(['/learner/dashboard']);
        break;

      default:
        this.notification.warning('Rôle utilisateur non reconnu.');
        void this.router.navigate(['/login']);
    }
  }
}
