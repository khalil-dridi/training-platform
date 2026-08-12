import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CurrentUserService } from '../../../../core/services/current-user';
import { LearnerDashboardResponse } from '../../models/learner-dashboard-response.model';
import { DashboardService } from '../../services/dashboard';
import { RecommendationList } from '../../components/recommendation-list/recommendation-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, RecommendationList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly currentUserService = inject(CurrentUserService);

  dashboard: LearnerDashboardResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.dashboardService.getLearnerDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load learner dashboard', error);
        this.dashboard = null;
        this.isLoading = false;
        this.errorMessage = 'Unable to load your dashboard.';
      },
    });
  }

  learnerFirstName(): string {
    return this.currentUserService.user()?.firstName ?? 'Learner';
  }

  progressDashOffset(): number {
    return 25;
  }
}
