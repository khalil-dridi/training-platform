import { Component, inject, OnInit } from '@angular/core';

import { UserResponse } from '../../../user/models/user-response.model';
import { PageResponse } from '../../models/page-response.model';
import { UserService } from '../../services/user';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {

  private readonly userService = inject(UserService);

  users: UserResponse[] = [];

  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService
      .getAllUsers(undefined, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          const page: PageResponse<UserResponse> = response.data;

          this.users = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
        },
        error: (error) => {
          console.error('Failed to load users', error);
        },
      });
  }
  searchUsers(search: string): void {
  this.currentPage = 0;

  this.userService
    .getAllUsers(search, this.currentPage, this.pageSize)
    .subscribe({
      next: (response) => {
        const page: PageResponse<UserResponse> = response.data;

        this.users = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
      },
      error: (error) => {
        console.error('Failed to search users', error);
      },
    });
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
}