import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../../services/user';
import { UserResponse } from '../../../../user/models/user-response.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [NgClass, RouterLink, MatIconModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  user: UserResponse | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser(id);
  }

  displayName(user: UserResponse): string {
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  }

  userInitials(user: UserResponse): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || '?';
  }

  formatRole(role: string): string {
    if (role === 'LEARNER') return 'Learner';
    if (role === 'TRAINER') return 'Trainer';
    if (role === 'ADMIN') return 'Admin';
    return role;
  }

  roleBadgeClass(role: string): Record<string, boolean> {
    return {
      'admin-list__badge--learner': role === 'LEARNER',
      'admin-list__badge--trainer': role === 'TRAINER',
      'admin-list__badge--admin': role === 'ADMIN',
    };
  }

  private loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        this.user = response.data;
      },
      error: (error) => {
        console.error('Failed to load user', error);
      },
    });
  }
}
