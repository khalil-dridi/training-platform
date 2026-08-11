import { Component, inject, OnInit } from '@angular/core';

import { CourseService } from '../../services/course';
import { CourseResponse } from '../models/course-response.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {

  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  courses: CourseResponse[] = [];

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

  
}