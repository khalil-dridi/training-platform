import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmationService } from '../../../../../shared/confirmation/confirmation.service';
import { ChapterService } from '../../../services/chapter';
import { ChapterResponse } from '../../models/chapter-response.model';
import { CourseService } from '../../../services/course';
import { CourseResponse } from '../../models/course-response.model';
import { LessonService } from '../../../services/lesson';
import { LessonResponse } from '../../models/lesson-response.model';

@Component({
  selector: 'app-course-content',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './course-content.html',
  styleUrl: './course-content.scss',
})
export class CourseContent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly chapterService = inject(ChapterService);
  private readonly lessonService = inject(LessonService);
  private readonly courseService = inject(CourseService);
  private readonly confirmation = inject(ConfirmationService);

  courseId!: number;
  course: CourseResponse | null = null;
  chapters: ChapterResponse[] = [];
  lessonsByChapter: Record<number, LessonResponse[]> = {};
  expandedChapters = new Set<number>();

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadCourse();
    this.loadChapters();
  }

  private loadCourse(): void {
    this.courseService.getMyCourseById(this.courseId).subscribe({
      next: (response) => {
        this.course = response.data;
      },
      error: (error) => {
        console.error('Failed to load course', error);
      },
    });
  }

  private loadChapters(): void {
    this.chapterService.getCourseChapters(this.courseId).subscribe({
      next: (response) => {
        this.chapters = [...response.data].sort((a, b) => a.position - b.position);

        this.chapters.forEach((chapter) => {
          this.expandedChapters.add(chapter.id);
          this.loadLessons(chapter.id);
        });
      },
      error: (error) => {
        console.error('Failed to load chapters', error);
      },
    });
  }

  private loadLessons(chapterId: number): void {
    this.lessonService.getChapterLessons(chapterId).subscribe({
      next: (response) => {
        this.lessonsByChapter[chapterId] = [...response.data].sort(
          (a, b) => a.position - b.position
        );
      },
      error: (error) => {
        console.error(`Failed to load lessons for chapter ${chapterId}`, error);
      },
    });
  }

  toggleChapter(chapterId: number): void {
    if (this.expandedChapters.has(chapterId)) {
      this.expandedChapters.delete(chapterId);
      return;
    }

    this.expandedChapters.add(chapterId);
  }

  isChapterExpanded(chapterId: number): boolean {
    return this.expandedChapters.has(chapterId);
  }

  lessonCount(chapterId: number): number {
    return this.lessonsByChapter[chapterId]?.length ?? 0;
  }

  deleteChapter(id: number): void {
    const chapter = this.chapters.find((item) => item.id === id);
    const title = chapter?.title ?? 'this chapter';

    this.confirmation
      .confirm({
        title: 'Delete this chapter?',
        message: `Delete "${title}" and all of its lessons? This action cannot be undone.`,
        confirmLabel: 'Delete chapter',
        cancelLabel: 'Cancel',
        tone: 'danger',
        icon: 'delete_forever',
        action: () => this.chapterService.deleteChapter(id),
        successMessage: `Chapter "${title}" deleted successfully.`,
        errorFallback: 'Failed to delete chapter.',
      })
      .subscribe({
        next: () => {
          this.chapters = this.chapters.filter((item) => item.id !== id);
          delete this.lessonsByChapter[id];
          this.expandedChapters.delete(id);
        },
      });
  }

  deleteLesson(id: number): void {
    let lessonTitle = 'this lesson';

    for (const chapterId of Object.keys(this.lessonsByChapter)) {
      const lesson = this.lessonsByChapter[Number(chapterId)]?.find(
        (item) => item.id === id
      );
      if (lesson) {
        lessonTitle = lesson.title;
        break;
      }
    }

    this.confirmation
      .confirm({
        title: 'Delete this lesson?',
        message: `Delete "${lessonTitle}" permanently? Learners will lose access to this content.`,
        confirmLabel: 'Delete lesson',
        cancelLabel: 'Cancel',
        tone: 'danger',
        icon: 'delete_forever',
        action: () => this.lessonService.deleteLesson(id),
        successMessage: `Lesson "${lessonTitle}" deleted successfully.`,
        errorFallback: 'Failed to delete lesson.',
      })
      .subscribe({
        next: () => {
          for (const chapterId in this.lessonsByChapter) {
            this.lessonsByChapter[chapterId] = this.lessonsByChapter[chapterId].filter(
              (lesson) => lesson.id !== id
            );
          }
        },
      });
  }
}
