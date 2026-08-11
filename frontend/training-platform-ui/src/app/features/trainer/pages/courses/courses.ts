import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmationService } from '../../../../shared/confirmation/confirmation.service';
import { CourseService } from '../../services/course';
import { CourseResponse } from '../models/course-response.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly router = inject(Router);

  courses: CourseResponse[] = [];
  searchQuery = '';

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getMyCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
      },
      error: (error) => {
        console.error('Failed to load courses', error);
      },
    });
  }

  deleteCourse(id: number): void {
    const course = this.courses.find((item) => item.id === id);
    const title = course?.title ?? 'this course';

    this.confirmation
      .confirm({
        title: 'Delete this course?',
        message: `Delete "${title}" permanently? Chapters, lessons and enrollments linked to it may be affected. This cannot be undone.`,
        confirmLabel: 'Delete course',
        cancelLabel: 'Cancel',
        tone: 'danger',
        icon: 'delete_forever',
        action: () => this.courseService.deleteCourse(id),
        successMessage: `Course "${title}" deleted successfully.`,
        errorFallback: 'Failed to delete course.',
      })
      .subscribe({
        next: () => {
          this.courses = this.courses.filter((item) => item.id !== id);
        },
      });
  }

  publishCourse(id: number): void {
    const course = this.courses.find((item) => item.id === id);
    const title = course?.title ?? 'this course';

    this.confirmation
      .confirm({
        title: 'Publish this course?',
        message: `Publish "${title}" and make it visible to learners on the platform?`,
        confirmLabel: 'Publish',
        cancelLabel: 'Cancel',
        tone: 'primary',
        icon: 'publish',
        action: () => this.courseService.publishCourse(id),
        successMessage: `Course "${title}" published successfully.`,
        errorFallback: 'Failed to publish course.',
      })
      .subscribe({
        next: (response) => {
          this.courses = this.courses.map((item) =>
            item.id === id ? response.data : item
          );
        },
      });
  }

  updateCourse(id: number): void {
    this.router.navigate(['/trainer/courses/edit', id]);
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  get filteredCourses(): CourseResponse[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.courses;
    }

    return this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.shortDescription.toLowerCase().includes(query) ||
        course.categoryName.toLowerCase().includes(query)
    );
  }

  paginationLabel(): string {
    const total = this.filteredCourses.length;
    const overall = this.courses.length;

    if (overall === 0) {
      return 'Showing 0 courses';
    }

    if (total === 0) {
      return `Showing 0 of ${overall} courses`;
    }

    return `Showing 1 to ${total} of ${overall} courses`;
  }

  metricPlaceholder(): string {
    return '—';
  }

  viewStudents(courseId: number): void {
    this.router.navigate(['/trainer/courses', courseId, 'students']);
  }
}
