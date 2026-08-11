import { Component, inject, OnInit } from '@angular/core';

import { DashboardService } from '../../services/dashboard';
import { TrainerDashboardResponse } from '../models/trainer-dashboard-response.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private readonly dashboardService = inject(DashboardService);

  dashboard: TrainerDashboardResponse | null = null;

  ngOnInit(): void {
    this.loadDashboard();
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
}