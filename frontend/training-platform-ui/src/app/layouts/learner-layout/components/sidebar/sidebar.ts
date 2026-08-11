import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../features/auth/services/auth-service';
import { CurrentUserService } from '../../../../core/services/current-user';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly router = inject(Router);

  readonly isMobileOpen = signal(false);

  toggleMobileNav(): void {
    this.isMobileOpen.update((open) => !open);
  }

  closeMobileNav(): void {
    this.isMobileOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.currentUserService.clear();
    void this.router.navigate(['/login']);
  }
}
