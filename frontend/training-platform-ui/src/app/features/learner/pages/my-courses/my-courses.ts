import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EnrollmentResponse } from '../../../trainer/pages/models/enrollment-response.model';
import { EnrollmentService } from '../../services/enrollment';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.scss',
})
export class MyCourses implements OnInit {
  private readonly enrollmentService = inject(EnrollmentService);

  enrollments: EnrollmentResponse[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.enrollmentService.getMyCourses().subscribe({
      next: (response) => {
        this.enrollments = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load my courses', error);
        this.enrollments = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load your courses.';
      },
    });
  }
}
