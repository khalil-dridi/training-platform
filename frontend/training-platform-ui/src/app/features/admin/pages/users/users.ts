import { Component, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UserResponse } from '../../../user/models/user-response.model';
import { PageResponse } from '../../models/page-response.model';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgClass, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private readonly userService = inject(UserService);

  users: UserResponse[] = [];
  loading = true;
  searchQuery = '';

  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadUsers();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.trim();
    this.currentPage = 0;
    this.loadUsers();
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

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    this.loading = true;

    const search = this.searchQuery || undefined;

    this.userService.getAllUsers(search, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const page: PageResponse<UserResponse> = response.data;

        this.users = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load users', error);
        this.loading = false;
      },
    });
  }
}
