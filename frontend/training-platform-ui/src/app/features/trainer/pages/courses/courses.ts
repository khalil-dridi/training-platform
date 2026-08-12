import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CourseService } from '../../services/course';
import { CourseResponse } from '../models/course-response.model';
import {
  CourseDetailDialog,
  CourseDetailDialogData,
} from './course-detail-dialog/course-detail-dialog';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly dialog = inject(MatDialog);

  courses: CourseResponse[] = [];
  readonly loading = signal(true);
  searchQuery = '';

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.loading.set(true);

    this.courseService.getMyCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load courses', error);
        this.loading.set(false);
      },
    });
  }

  openCourseDetail(course: CourseResponse): void {
    const data: CourseDetailDialogData = {
      course,
      onChanged: () => this.loadCourses(),
    };

    const dialogRef = this.dialog.open(CourseDetailDialog, {
      data,
      width: '36rem',
      maxWidth: '95vw',
      autoFocus: 'dialog',
      restoreFocus: true,
      panelClass: ['tp-course-detail-panel'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.deleted) {
        this.courses = this.courses.filter((item) => item.id !== result.id);
      }
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

  publishedCount(): number {
    return this.courses.filter((course) => course.status === 'PUBLISHED').length;
  }

  draftCount(): number {
    return this.courses.filter((course) => course.status === 'DRAFT').length;
  }

  paginationLabel(): string {
    const total = this.filteredCourses.length;
    const overall = this.courses.length;

    if (overall === 0) {
      return 'No courses yet';
    }

    if (total === 0) {
      return `No matches among ${overall} courses`;
    }

    return `${total} of ${overall} courses`;
  }

  formatLevel(level: string): string {
    if (level === 'BEGINNER') return 'Beginner';
    if (level === 'INTERMEDIATE') return 'Intermediate';
    if (level === 'ADVANCED') return 'Advanced';
    return level;
  }
}
