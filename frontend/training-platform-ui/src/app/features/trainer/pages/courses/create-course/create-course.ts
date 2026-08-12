import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';

import { CategoryService } from '../../../services/category';
import { CategoryResponse } from '../../../../admin/models/category-response.model';
import { CourseService } from '../../../services/course';
import { CourseLevel } from '../../models/course-level.model';
import { CreateCourseRequest } from '../../models/create-course-request.model';
import { ConfirmationService } from '../../../../../shared/confirmation/confirmation.service';
import { NotificationService } from '../../../../../shared/notifications/notification.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-course.html',
  styleUrl: './create-course.scss',
})
export class CreateCourse implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly confirmation = inject(ConfirmationService);
  private readonly notification = inject(NotificationService);

  categories: CategoryResponse[] = [];
  readonly loadingCategories = signal(true);
  readonly isSubmitting = signal(false);

  selectedThumbnail: File | null = null;
  thumbnailPreviewUrl: string | null = null;
  thumbnailTouched = false;

  courseForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    shortDescription: ['', [Validators.required, Validators.maxLength(300)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    level: [CourseLevel.BEGINNER, [Validators.required]],
    language: ['', [Validators.required]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loadingCategories.set(true);

    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loadingCategories.set(false);
      },
      error: (error) => {
        console.error('Failed to load categories', error);
        this.loadingCategories.set(false);
        this.notification.error('Failed to load categories. Please refresh the page.');
      },
    });
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedThumbnail = input.files[0];
    this.thumbnailTouched = true;

    if (this.thumbnailPreviewUrl) {
      URL.revokeObjectURL(this.thumbnailPreviewUrl);
    }

    this.thumbnailPreviewUrl = URL.createObjectURL(this.selectedThumbnail);
  }

  cancel(): void {
    void this.router.navigate(['/trainer/courses']);
  }

  createCourse(): void {
    this.thumbnailTouched = true;

    if (this.courseForm.invalid || !this.selectedThumbnail) {
      this.courseForm.markAllAsTouched();
      this.notification.warning('Please complete all required fields before creating the course.');
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    const request: CreateCourseRequest = this.courseForm.getRawValue();
    const title = request.title.trim();
    const thumbnail = this.selectedThumbnail;

    this.confirmation
      .confirm({
        title: 'Create this course?',
        message: `Create "${title}" as a new draft course? You can add chapters and publish it later.`,
        confirmLabel: 'Create course',
        cancelLabel: 'Cancel',
        tone: 'primary',
        icon: 'add_circle_outline',
        action: () => {
          this.isSubmitting.set(true);

          return this.courseService.createCourse(request, thumbnail).pipe(
            finalize(() => this.isSubmitting.set(false))
          );
        },
        successMessage: `Course "${title}" created successfully.`,
        errorFallback: 'Failed to create course. Please try again.',
      })
      .subscribe({
        next: () => {
          void this.router.navigate(['/trainer/courses']);
        },
      });
  }
}
