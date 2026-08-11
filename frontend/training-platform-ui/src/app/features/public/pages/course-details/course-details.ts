import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CourseLevel } from '../../../trainer/pages/models/course-level.model';
import { CourseResponse } from '../../../trainer/pages/models/course-response.model';
import { CourseService } from '../../services/course';

@Component({
  selector: 'app-public-course-details',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class PublicCourseDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  course: CourseResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const courseId = Number(idParam);

    if (!idParam || Number.isNaN(courseId) || courseId <= 0) {
      this.errorMessage = 'Course not found.';
      return;
    }

    this.loadCourse(courseId);
  }

  loadCourse(courseId: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.courseService.getPublishedCourseById(courseId).subscribe({
      next: (response) => {
        this.course = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load course', error);
        this.isLoading = false;
        this.errorMessage =
          error.status === 404 ? 'Course not found.' : 'Unable to load course.';
      },
    });
  }

  formatLevel(level: CourseLevel): string {
    const labels: Record<CourseLevel, string> = {
      [CourseLevel.BEGINNER]: 'Beginner',
      [CourseLevel.INTERMEDIATE]: 'Intermediate',
      [CourseLevel.ADVANCED]: 'Advanced',
    };

    return labels[level] ?? level;
  }

  levelBadgeClass(level: CourseLevel): string {
    const classes: Record<CourseLevel, string> = {
      [CourseLevel.BEGINNER]: 'public-course-details__level--beginner',
      [CourseLevel.INTERMEDIATE]: 'public-course-details__level--intermediate',
      [CourseLevel.ADVANCED]: 'public-course-details__level--advanced',
    };

    return classes[level] ?? '';
  }

  isFreeCourse(): boolean {
    return (this.course?.price ?? 0) <= 0;
  }
}
