import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

import { CurrentUserService } from '../../../../core/services/current-user';
import { DashboardService } from '../../services/dashboard';
import { CourseService } from '../../services/course';
import { CourseResponse } from '../models/course-response.model';
import { TrainerDashboardResponse } from '../models/trainer-dashboard-response.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly courseService = inject(CourseService);

  readonly currentUserService = inject(CurrentUserService);

  dashboard: TrainerDashboardResponse | null = null;
  recentCourses: CourseResponse[] = [];

  ngOnInit(): void {
    this.loadDashboard();
    this.loadRecentCourses();
  }

  private loadDashboard(): void {
    this.dashboardService.getTrainerDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
      },
      error: (error) => {
        console.error('Failed to load trainer dashboard', error);
      },
    });
  }

  private loadRecentCourses(): void {
    this.courseService.getMyCourses().subscribe({
      next: (response) => {
        this.recentCourses = [...response.data]
          .sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5);
      },
      error: (error) => {
        console.error('Failed to load recent courses', error);
      },
    });
  }

  trainerFirstName(): string {
    return this.currentUserService.user()?.firstName ?? 'Trainer';
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
