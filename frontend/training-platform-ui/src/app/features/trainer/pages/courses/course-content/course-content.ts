import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { ChapterService } from '../../../services/chapter';
import { ChapterResponse } from '../../models/chapter-response.model';

import { LessonService } from '../../../services/lesson';
import { LessonResponse } from '../../models/lesson-response.model';

@Component({
  selector: 'app-course-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-content.html',
  styleUrl: './course-content.scss',
})
export class CourseContent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly chapterService = inject(ChapterService);
  private readonly lessonService = inject(LessonService);

  courseId!: number;

  chapters: ChapterResponse[] = [];

  lessonsByChapter: Record<number, LessonResponse[]> = {};

  ngOnInit(): void {
    this.courseId = Number(
      this.route.snapshot.paramMap.get('courseId')
    );

    this.loadChapters();
  }

  private loadChapters(): void {
    this.chapterService.getCourseChapters(this.courseId).subscribe({
      next: (response) => {
        this.chapters = response.data;

        this.chapters.forEach(chapter => {
          this.loadLessons(chapter.id);
        });
      },

      error: (error) => {
        console.error(
          'Failed to load chapters',
          error
        );
      },
    });
  }

  private loadLessons(chapterId: number): void {
    this.lessonService.getChapterLessons(chapterId).subscribe({
      next: (response) => {
        this.lessonsByChapter[chapterId] = response.data;
      },

      error: (error) => {
        console.error(
          `Failed to load lessons for chapter ${chapterId}`,
          error
        );
      },
    });
  }

  deleteChapter(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this chapter?'
    );

    if (!confirmed) {
      return;
    }

    this.chapterService.deleteChapter(id).subscribe({
      next: () => {
        this.chapters = this.chapters.filter(
          chapter => chapter.id !== id
        );

        delete this.lessonsByChapter[id];
      },

      error: (error) => {
        console.error(
          'Failed to delete chapter',
          error
        );
      },
    });
  }
  deleteLesson(id: number): void {
  const confirmed = confirm(
    'Are you sure you want to delete this lesson?'
  );

  if (!confirmed) {
    return;
  }

  this.lessonService.deleteLesson(id).subscribe({
    next: () => {
      for (const chapterId in this.lessonsByChapter) {
        this.lessonsByChapter[chapterId] =
          this.lessonsByChapter[chapterId].filter(
            lesson => lesson.id !== id
          );
      }
    },

    error: (error) => {
      console.error(
        'Failed to delete lesson',
        error
      );
    },
  });
}
}