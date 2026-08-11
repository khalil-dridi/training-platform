import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CourseResponse } from '../../../trainer/pages/models/course-response.model';
import { CourseLevel } from '../../../trainer/pages/models/course-level.model';
import { CourseService } from '../../services/course';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  private readonly courseService = inject(CourseService);

  courses: CourseResponse[] = [];
  searchQuery = '';
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.courseService.getPublishedCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load published courses', error);
        this.courses = [];
        this.isLoading = false;
        this.errorMessage = 'Unable to load courses.';
      },
    });
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

  formatLevel(level: CourseLevel): string {
    const labels: Record<CourseLevel, string> = {
      [CourseLevel.BEGINNER]: 'Beginner',
      [CourseLevel.INTERMEDIATE]: 'Intermediate',
      [CourseLevel.ADVANCED]: 'Advanced',
    };

    return labels[level] ?? level;
  }
}
