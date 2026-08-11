import { Component, inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { NotificationService } from '../../../../shared/notifications/notification.service';
import { ChapterResponse } from '../../../trainer/pages/models/chapter-response.model';
import { LessonProgressResponse } from '../../../trainer/pages/models/Lesson-Progress-Response';
import { LessonResponse } from '../../../trainer/pages/models/lesson-response.model';
import { ChapterService } from '../../services/chapter';
import { EnrollmentService } from '../../services/enrollment';
import { LessonProgressService } from '../../services/lesson-progress';
import { LessonService } from '../../services/lesson';
import { ChapterWithLessons } from './models/chapter-with-lessons.model';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './learning.html',
  styleUrl: './learning.scss',
})
export class Learning implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly chapterService = inject(ChapterService);
  private readonly lessonService = inject(LessonService);
  private readonly lessonProgressService = inject(LessonProgressService);
  private readonly notification = inject(NotificationService);

  courseId = 0;
  courseTitle = '';
  chaptersWithLessons: ChapterWithLessons[] = [];
  flatLessons: LessonResponse[] = [];
  lessonProgressMap: Record<number, boolean> = {};
  currentLesson: LessonResponse | null = null;

  isLoading = false;
  errorMessage: string | null = null;
  isCompleting = false;
  isUncompleting = false;

  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const parsedId = Number(courseIdParam);

    if (!courseIdParam || Number.isNaN(parsedId) || parsedId <= 0) {
      this.errorMessage = 'Unable to load this course.';
      return;
    }

    this.courseId = parsedId;
    this.loadLearningData();
  }

  loadLearningData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.chaptersWithLessons = [];
    this.flatLessons = [];
    this.currentLesson = null;

    this.enrollmentService.getEnrollment(this.courseId).subscribe({
      next: (enrollmentResponse) => {
        this.courseTitle = enrollmentResponse.data.courseTitle;
        this.loadCourseContent();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to verify enrollment', error);
        this.isLoading = false;
        this.errorMessage =
          error.status === 404
            ? 'You must be enrolled in this course to access the learning player.'
            : 'Unable to load this course.';
      },
    });
  }

  selectLesson(lesson: LessonResponse): void {
    this.currentLesson = lesson;
  }

  isLessonActive(lessonId: number): boolean {
    return this.currentLesson?.id === lessonId;
  }

  isLessonCompleted(lessonId: number): boolean {
    return this.lessonProgressMap[lessonId] === true;
  }

  completedLessonsCount(): number {
    return this.flatLessons.filter((lesson) => this.isLessonCompleted(lesson.id)).length;
  }

  totalLessonsCount(): number {
    return this.flatLessons.length;
  }

  courseProgressPercent(): number {
    const total = this.totalLessonsCount();

    if (total === 0) {
      return 0;
    }

    return Math.round((this.completedLessonsCount() / total) * 100);
  }

  currentLessonIndex(): number {
    if (!this.currentLesson) {
      return -1;
    }

    return this.flatLessons.findIndex((lesson) => lesson.id === this.currentLesson!.id);
  }

  canGoPrevious(): boolean {
    return this.currentLessonIndex() > 0;
  }

  canGoNext(): boolean {
    const index = this.currentLessonIndex();
    return index >= 0 && index < this.flatLessons.length - 1;
  }

  previousLesson(): void {
    const index = this.currentLessonIndex();

    if (index > 0) {
      this.currentLesson = this.flatLessons[index - 1];
    }
  }

  nextLesson(): void {
    const index = this.currentLessonIndex();

    if (index >= 0 && index < this.flatLessons.length - 1) {
      this.currentLesson = this.flatLessons[index + 1];
    }
  }

  markAsCompleted(): void {
    if (!this.currentLesson || this.isCompleting || this.isLessonCompleted(this.currentLesson.id)) {
      return;
    }

    this.isCompleting = true;

    this.lessonProgressService.completeLesson(this.currentLesson.id).subscribe({
      next: (response) => {
        this.lessonProgressMap[this.currentLesson!.id] = response.data.completed;
        this.isCompleting = false;
        this.notification.success('Lesson marked as completed.');
      },
      error: (error) => {
        console.error('Failed to complete lesson', error);
        this.isCompleting = false;
        this.notification.errorFromHttp(error, 'Unable to mark lesson as completed.');
      },
    });
  }

  markAsIncomplete(): void {
    if (!this.currentLesson || this.isUncompleting || !this.isLessonCompleted(this.currentLesson.id)) {
      return;
    }

    this.isUncompleting = true;

    this.lessonProgressService.uncompleteLesson(this.currentLesson.id).subscribe({
      next: (response) => {
        this.lessonProgressMap[this.currentLesson!.id] = response.data.completed;
        this.isUncompleting = false;
        this.notification.success('Lesson marked as incomplete.');
      },
      error: (error) => {
        console.error('Failed to uncomplete lesson', error);
        this.isUncompleting = false;
        this.notification.errorFromHttp(error, 'Unable to mark lesson as incomplete.');
      },
    });
  }

  formatDuration(minutes: number): string {
    return `${minutes} min`;
  }

  private loadCourseContent(): void {
    forkJoin({
      chapters: this.chapterService.getLearnerCourseChapters(this.courseId),
      progress: this.lessonProgressService.getCourseProgress(this.courseId),
    })
      .pipe(
        switchMap(({ chapters, progress }) => {
          this.lessonProgressMap = this.buildProgressMap(progress.data);
          const sortedChapters = this.sortChapters(chapters.data);

          if (sortedChapters.length === 0) {
            this.chaptersWithLessons = [];
            this.flatLessons = [];
            return of<ChapterWithLessons[]>([]);
          }

          const lessonRequests = sortedChapters.map((chapter) =>
            this.lessonService.getLearnerChapterLessons(chapter.id).pipe(
              map((lessonsResponse) => ({
                chapter,
                lessons: this.sortLessons(lessonsResponse.data),
              }))
            )
          );

          return forkJoin(lessonRequests);
        })
      )
      .subscribe({
        next: (chaptersWithLessons) => {
          this.chaptersWithLessons = chaptersWithLessons;
          this.flatLessons = chaptersWithLessons.flatMap((item) => item.lessons);
          this.selectInitialLesson();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load course content', error);
          this.isLoading = false;
          this.errorMessage = 'Unable to load this course.';
        },
      });
  }

  private selectInitialLesson(): void {
    this.currentLesson = this.flatLessons[0] ?? null;
  }

  private buildProgressMap(progressItems: LessonProgressResponse[]): Record<number, boolean> {
    return progressItems.reduce<Record<number, boolean>>((map, item) => {
      map[item.lessonId] = item.completed;
      return map;
    }, {});
  }

  private sortChapters(chapters: ChapterResponse[]): ChapterResponse[] {
    return [...chapters].sort((a, b) => a.position - b.position);
  }

  private sortLessons(lessons: LessonResponse[]): LessonResponse[] {
    return [...lessons].sort((a, b) => a.position - b.position);
  }
}
