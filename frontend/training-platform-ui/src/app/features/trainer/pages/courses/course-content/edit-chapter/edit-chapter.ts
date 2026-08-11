import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ChapterService } from '../../../../services/chapter';
import { ChapterResponse } from '../../../models/chapter-response.model';
import { UpdateChapterRequest } from '../../../models/update-chapter-request.model';

@Component({
  selector: 'app-edit-chapter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-chapter.html',
  styleUrl: './edit-chapter.scss',
})
export class EditChapter implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly chapterService = inject(ChapterService);
  private readonly router = inject(Router);
  courseId!: number;
  chapterId!: number;

  chapter: ChapterResponse | null = null;

  chapterForm = this.fb.nonNullable.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(200),
    ]],

    description: ['', [
      Validators.maxLength(1000),
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
      this.route.snapshot.paramMap.get('id')
    );

    this.loadChapter();
  }

  private loadChapter(): void {
    this.chapterService
      .getCourseChapters(this.courseId)
      .subscribe({
        next: (response) => {

          const chapter = response.data.find(
            chapter => chapter.id === this.chapterId
          );

          if (!chapter) {
            console.error('Chapter not found');
            return;
          }

          this.chapter = chapter;

          this.chapterForm.patchValue({
            title: chapter.title,
            description: chapter.description ?? '',
            position: chapter.position,
          });
        },

        error: (error) => {
          console.error(
            'Failed to load chapter',
            error
          );
        },
      });
  }
  updateChapter(): void {
  if (this.chapterForm.invalid) {
    this.chapterForm.markAllAsTouched();
    return;
  }

  const request: UpdateChapterRequest =
    this.chapterForm.getRawValue();

  this.chapterService.updateChapter(
    this.chapterId,
    request
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
        'Failed to update chapter',
        error
      );
    },
  });
}
}