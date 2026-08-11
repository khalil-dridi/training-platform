import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LessonService } from '../../../../services/lesson';
import { LessonResponse } from '../../../models/lesson-response.model';
import { UpdateLessonRequest } from '../../../models/update-lesson-request.model';

@Component({
  selector: 'app-edit-lesson',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './edit-lesson.html',
  styleUrl: './edit-lesson.scss',
})
export class EditLesson implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly lessonService = inject(LessonService);
  private readonly router = inject(Router);
  courseId!: number;
  chapterId!: number;
  lessonId!: number;

  lesson: LessonResponse | null = null;

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

    this.courseId = Number(
      this.route.snapshot.paramMap.get('courseId')
    );

    this.chapterId = Number(
      this.route.snapshot.paramMap.get('chapterId')
    );

    this.lessonId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadLesson();
  }

  private loadLesson(): void {
    this.lessonService
      .getChapterLessons(this.chapterId)
      .subscribe({
        next: (response) => {

          const lesson = response.data.find(
            lesson => lesson.id === this.lessonId
          );

          if (!lesson) {
            console.error('Lesson not found');
            return;
          }

          this.lesson = lesson;

          this.lessonForm.patchValue({
            title: lesson.title,
            description: lesson.description ?? '',
            duration: lesson.duration,
            preview: lesson.preview,
            position: lesson.position,
          });
        },

        error: (error) => {
          console.error(
            'Failed to load lesson',
            error
          );
        },
      });
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedVideo = input.files[0];
  }
  updateLesson(): void {
  if (this.lessonForm.invalid) {
    this.lessonForm.markAllAsTouched();
    return;
  }

  const request: UpdateLessonRequest =
    this.lessonForm.getRawValue();

  this.lessonService.updateLesson(
    this.lessonId,
    request,
    this.selectedVideo ?? undefined
  ).subscribe({
    next: () => {
      this.router.navigate([
        '/trainer/courses',
        this.courseId,
        'content'
      ]);
    },

    error: (error) => {
      console.error(
        'Failed to update lesson',
        error
      );
    },
  });
}
}