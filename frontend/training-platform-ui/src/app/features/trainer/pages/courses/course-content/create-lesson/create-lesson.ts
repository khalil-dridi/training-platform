import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { LessonService } from '../../../../services/lesson';
import { CreateLessonRequest } from '../../../models/create-lesson-request.model';

@Component({
  selector: 'app-create-lesson',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './create-lesson.html',
  styleUrl: './create-lesson.scss',
})
export class CreateLesson implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly lessonService = inject(LessonService);
  private readonly router = inject(Router);

  chapterId!: number;
  courseId!: number;
  selectedVideo: File | null = null;
  videoTouched = false;

  lessonForm = this.fb.nonNullable.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(200),
    ]],

    description: ['', [
      Validators.maxLength(1000),
    ]],

    duration: [1, [
      Validators.required,
      Validators.min(1),
    ]],

    preview: [false, [
      Validators.required,
    ]],

    position: [1, [
      Validators.required,
      Validators.min(1),
    ]],
  });

  ngOnInit(): void {
    this.chapterId = Number(this.route.snapshot.paramMap.get('chapterId'));
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedVideo = input.files[0];
    this.videoTouched = true;
  }

  cancel(): void {
    void this.router.navigate(['/trainer/courses', this.courseId, 'content']);
  }

  createLesson(): void {
    this.videoTouched = true;

    if (this.lessonForm.invalid || !this.selectedVideo) {
      this.lessonForm.markAllAsTouched();
      return;
    }

    const request: CreateLessonRequest = {
      ...this.lessonForm.getRawValue(),
      chapterId: this.chapterId,
    };

    this.lessonService.createLesson(
      request,
      this.selectedVideo
    ).subscribe({
      next: () => {
        void this.router.navigate(['/trainer/courses', this.courseId, 'content']);
      },
      error: (error) => {
        console.error(
          'Failed to create lesson',
          error
        );
      },
    });
  }
}