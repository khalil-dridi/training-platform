import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CategoryService } from '../../../services/category';
import { CategoryResponse } from '../../../../admin/models/category-response.model';
import { CourseService } from '../../../services/course';
import { Router } from '@angular/router';
import { CourseLevel } from '../../models/course-level.model';
import { CreateCourseRequest } from '../../models/create-course-request.model';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-course.html',
  styleUrl: './create-course.scss',
})
export class CreateCourse implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  categories: CategoryResponse[] = [];

  courseForm = this.fb.nonNullable.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(200),
    ]],

    shortDescription: ['', [
      Validators.required,
      Validators.maxLength(300),
    ]],

    description: ['', [
      Validators.required,
    ]],

    price: [0, [
      Validators.required,
      Validators.min(0),
    ]],

    level: [CourseLevel.BEGINNER, [
      Validators.required,
    ]],

    language: ['', [
      Validators.required,
    ]],

    categoryId: [0, [
      Validators.required,
      Validators.min(1),
    ]],
  });

  selectedThumbnail: File | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Failed to load categories', error);
      },
    });
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedThumbnail = input.files[0];
  }

  createCourse(): void {
    if (this.courseForm.invalid || !this.selectedThumbnail) {
      this.courseForm.markAllAsTouched();
      return;
    }

    const request: CreateCourseRequest =
      this.courseForm.getRawValue();

    this.courseService.createCourse(
      request,
      this.selectedThumbnail
    ).subscribe({
      next: (response) => {
  console.log(
    'Course created successfully',
    response.data
  );

  this.router.navigate(['/trainer/courses']);
},
      error: (error) => {
        console.error(
          'Failed to create course',
          error
        );
      },
    });
  }
}