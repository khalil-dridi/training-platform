import { Component, inject, OnInit } from '@angular/core';

import { AdminDashboardResponse } from '../../models/admin-dashboard-response.model';
import { DashboardService } from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private readonly dashboardService = inject(DashboardService);

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
}