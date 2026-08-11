import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LessonService } from '../../../../services/lesson';
import { CreateLessonRequest } from '../../../models/create-lesson-request.model';

@Component({
  selector: 'app-create-lesson',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-lesson.html',
  styleUrl: './create-lesson.scss',
})
export class CreateLesson implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly lessonService = inject(LessonService);
  private readonly router = inject(Router);
  chapterId!: number;

  selectedVideo: File | null = null;

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
    this.chapterId = Number(
      this.route.snapshot.paramMap.get('chapterId')
    );
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedVideo = input.files[0];
  }

  createLesson(): void {
    if (
      this.lessonForm.invalid ||
      !this.selectedVideo
    ) {
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
  const courseId = Number(
    this.route.snapshot.paramMap.get('courseId')
  );

  this.router.navigate([
    '/trainer/courses',
    courseId,
    'content'
  ]);
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