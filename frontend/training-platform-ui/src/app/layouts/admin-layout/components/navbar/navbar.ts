import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CurrentUserService } from '../../../../core/services/current-user';
import { AuthService } from '../../../../features/auth/services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  readonly currentUserService = inject(CurrentUserService);
  private readonly authService = inject(AuthService);
private readonly router = inject(Router);



logout(): void {
  this.authService.logout();
  this.currentUserService.clear();
  this.router.navigate(['/login']);}

}