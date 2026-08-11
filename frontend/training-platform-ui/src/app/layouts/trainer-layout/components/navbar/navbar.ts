import { Component, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';

import { CurrentUserService } from '../../../../core/services/current-user';
import { UserResponse } from '../../../../features/user/models/user-response.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly menuToggle = output<void>();

  readonly currentUserService = inject(CurrentUserService);

  private readonly router = inject(Router);

  readonly pageTitle = signal('Trainer Dashboard');

  constructor() {
    this.updatePageTitle();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.updatePageTitle());
  }

  onMenuClick(): void {
    this.menuToggle.emit();
  }

  displayName(user: UserResponse): string {
    const name = `${user.firstName} ${user.lastName}`.trim();
    return name || 'John Doe';
  }

  displayRole(user: UserResponse): string {
    return user.role === 'TRAINER' ? 'Trainer' : user.role;
  }

  userInitials(user: UserResponse): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || 'JD';
  }

  private updatePageTitle(): void {
    this.pageTitle.set(this.resolvePageTitle(this.router.url));
  }

  private resolvePageTitle(url: string): string {
    if (url.includes('/trainer/courses')) {
      return 'My Courses';
    }

    if (url.includes('/trainer/students')) {
      return 'My Students';
    }

    if (url.includes('/trainer/profile')) {
      return 'Profile';
    }

    return 'Trainer Dashboard';
  }
}
