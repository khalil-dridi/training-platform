import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  const confirmed = confirm(
    'Are you sure you want to delete this course?'
  );

  if (!confirmed) {
    return;
  }

  this.courseService.deleteCourse(id).subscribe({
    next: () => {
      this.courses = this.courses.filter(
        course => course.id !== id
      );
    },
    error: (error) => {
      console.error(
        'Failed to delete course',
        error
      );
    },
  });
}
publishCourse(id: number): void {
  this.courseService.publishCourse(id).subscribe({
    next: (response) => {
      this.courses = this.courses.map(course =>
        course.id === id
          ? response.data
          : course
      );
    },
    error: (error) => {
      console.error(
        'Failed to publish course',
        error
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
  this.router.navigate([
    '/trainer/courses',
    courseId,
    'students'
  ]);
}
}