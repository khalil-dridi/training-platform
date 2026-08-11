import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CourseService } from '../../../services/course';
import { CourseLevel } from '../../../pages/models/course-level.model';
import { CourseResponse } from '../../../pages/models/course-response.model';
import { CategoryService } from '../../../services/category';
import { CategoryResponse } from '../../../../admin/models/category-response.model';
import { UpdateCourseRequest } from '../../models/update-course-request.model';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.scss',
})
export class EditCourse implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  categories: CategoryResponse[] = [];
  selectedThumbnail: File | null = null;
  thumbnailPreviewUrl: string | null = null;
  course: CourseResponse | null = null;
  courseId!: number;

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

  ngOnInit(): void {
  this.courseId = Number(
    this.route.snapshot.paramMap.get('id')
  );

  this.loadCategories();
  this.loadCourse();
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

  private loadCourse(): void {
    this.courseService.getMyCourseById(this.courseId).subscribe({
      next: (response) => {
        this.course = response.data;

        this.courseForm.patchValue({
          title: response.data.title,
          shortDescription: response.data.shortDescription,
          description: response.data.description,
          price: response.data.price,
          level: response.data.level,
          language: response.data.language,
          categoryId: response.data.categoryId,
        });
      },
      error: (error) => {
        console.error('Failed to load course', error);
      },
    });
  }
  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedThumbnail = input.files[0];

    if (this.thumbnailPreviewUrl) {
      URL.revokeObjectURL(this.thumbnailPreviewUrl);
    }

    this.thumbnailPreviewUrl = URL.createObjectURL(this.selectedThumbnail);
  }

  cancel(): void {
    void this.router.navigate(['/trainer/courses']);
  }

  updateCourse(): void {
  if (this.courseForm.invalid) {
    this.courseForm.markAllAsTouched();
    return;
  }

  const request: UpdateCourseRequest =
    this.courseForm.getRawValue();

  this.courseService.updateCourse(
    this.courseId,
    request,
    this.selectedThumbnail ?? undefined
  ).subscribe({
    next: (response) => {
      console.log(
        'Course updated successfully',
        response.data
      );

      this.router.navigate(['/trainer/courses']);
    },
    error: (error) => {
      console.error(
        'Failed to update course',
        error
      );
    },
  });
}
}