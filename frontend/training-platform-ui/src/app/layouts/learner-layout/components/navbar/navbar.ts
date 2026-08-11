import { Component, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';

import { CurrentUserService } from '../../../../core/services/current-user';
import { UserResponse } from '../../../../features/user/models/user-response.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly menuToggle = output<void>();

  readonly currentUserService = inject(CurrentUserService);

  private readonly router = inject(Router);

  readonly pageTitle = signal('Learner Dashboard');

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
    return name || 'Learner User';
  }

  displayRole(user: UserResponse): string {
    return user.role === 'LEARNER' ? 'Learner' : user.role;
  }

  userInitials(user: UserResponse): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || 'LR';
  }

  private updatePageTitle(): void {
    this.pageTitle.set(this.resolvePageTitle(this.router.url));
  }

  private resolvePageTitle(url: string): string {
    if (url.includes('/learner/courses') && !url.includes('/learner/my-courses')) {
      return 'Browse Courses';
    }

    if (url.includes('/learner/my-courses')) {
      return 'My Courses';
    }

    if (url.includes('/learner/profile')) {
      return 'Profile';
    }

    return 'Learner Dashboard';
  }
}
