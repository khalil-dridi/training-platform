import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService } from '../../../../../shared/notifications/notification.service';
import { CourseResponse } from '../../../../trainer/pages/models/course-response.model';
import { CourseLevel } from '../../../../trainer/pages/models/course-level.model';
import { CourseService } from '../../../services/course';
import { EnrollmentService } from '../../../services/enrollment';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly notification = inject(NotificationService);

  course: CourseResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  canRetry = false;
  isEnrolled = false;
  isCheckingEnrollment = false;
  isEnrolling = false;

  private courseId = 0;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = Number(idParam);

    if (!idParam || Number.isNaN(parsedId) || parsedId <= 0) {
      this.errorMessage = 'Course not found.';
      this.canRetry = false;
      return;
    }

    this.courseId = parsedId;
    this.canRetry = true;
    this.loadCourse();
  }

  loadCourse(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.course = null;

    this.courseService.getPublishedCourseById(this.courseId).subscribe({
      next: (response) => {
        this.course = response.data;
        this.isLoading = false;
        this.checkEnrollment();
      },
      error: (error) => {
        console.error('Failed to load course details', error);
        this.isLoading = false;
        this.errorMessage =
          error.status === 404
            ? 'Course not found.'
            : 'Unable to load course details.';
      },
    });
  }

  checkEnrollment(): void {
    this.isCheckingEnrollment = true;

    this.enrollmentService.getEnrollment(this.courseId).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.isCheckingEnrollment = false;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.isEnrolled = false;
        }

        this.isCheckingEnrollment = false;
      },
    });
  }

  enrollInCourse(): void {
    if (this.isEnrolled || this.isEnrolling || this.isCheckingEnrollment) {
      return;
    }

    this.isEnrolling = true;

    this.enrollmentService.enroll(this.courseId).subscribe({
      next: () => {
        this.isEnrolled = true;
        this.isEnrolling = false;
        this.notification.success('You are now enrolled in this course.');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to enroll in course', error);
        this.isEnrolling = false;

        const apiMessage = this.resolveApiMessage(error);

        if (apiMessage === 'You are already enrolled in this course.') {
          this.isEnrolled = true;
          this.notification.error(apiMessage);
          return;
        }

        if (apiMessage === 'This course is not available.') {
          this.notification.error(apiMessage);
          return;
        }

        this.notification.errorFromHttp(
          error,
          'Unable to enroll in this course.'
        );
      },
    });
  }

  private resolveApiMessage(error: HttpErrorResponse): string | null {
    const apiMessage = error.error?.message;

    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage.trim();
    }

    return null;
  }

  formatLevel(level: CourseLevel): string {
    const labels: Record<CourseLevel, string> = {
      [CourseLevel.BEGINNER]: 'Beginner',
      [CourseLevel.INTERMEDIATE]: 'Intermediate',
      [CourseLevel.ADVANCED]: 'Advanced',
    };

    return labels[level] ?? level;
  }
}
