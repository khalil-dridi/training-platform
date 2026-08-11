import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ChapterService } from '../../../../services/chapter';
import { CreateChapterRequest } from '../../../models/create-chapter-request.model';

@Component({
  selector: 'app-create-chapter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-chapter.html',
  styleUrl: './create-chapter.scss',
})
export class CreateChapter implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly chapterService = inject(ChapterService);
  private readonly router = inject(Router);
  courseId!: number;

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
  }

  createChapter(): void {
  if (this.chapterForm.invalid) {
    this.chapterForm.markAllAsTouched();
    return;
  }

  const request: CreateChapterRequest = {
    ...this.chapterForm.getRawValue(),
    courseId: this.courseId,
  };

  this.chapterService.createChapter(request).subscribe({
    next: () => {
      this.router.navigate([
        '/trainer/courses',
        this.courseId,
        'content'
      ]);
    },
    error: (error) => {
      console.error(
        'Failed to create chapter',
        error
      );
    },
  });
}
}