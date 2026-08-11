import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CurrentUserService } from '../../../../core/services/current-user';
import { AdminDashboardResponse } from '../../models/admin-dashboard-response.model';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly currentUserService = inject(CurrentUserService);

  dashboard: AdminDashboardResponse | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardService.getAdminDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
      },
      error: (error) => {
        console.error('Failed to load admin dashboard', error);
      },
    });
  }

  adminFirstName(): string {
    return this.currentUserService.user()?.firstName ?? 'Admin';
  }

  rolePercent(count: number): number {
    if (!this.dashboard || this.dashboard.totalUsers === 0) {
      return 0;
    }

    return Math.round((count / this.dashboard.totalUsers) * 100);
  }

  publishedPercent(): number {
    if (!this.dashboard || this.dashboard.totalCourses === 0) {
      return 0;
    }

    return (this.dashboard.publishedCourses / this.dashboard.totalCourses) * 100;
  }

  draftPercent(): number {
    if (!this.dashboard || this.dashboard.totalCourses === 0) {
      return 0;
    }

    return (this.dashboard.draftCourses / this.dashboard.totalCourses) * 100;
  }

  publishedDashOffset(): number {
    return 25;
  }

  draftDashOffset(): number {
    return 25 - this.publishedPercent();
  }
}
