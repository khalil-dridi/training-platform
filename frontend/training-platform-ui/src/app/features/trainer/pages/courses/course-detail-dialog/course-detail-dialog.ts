import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { CourseResponse } from '../../models/course-response.model';
import { ConfirmationService } from '../../../../../shared/confirmation/confirmation.service';
import { CourseService } from '../../../services/course';

export interface CourseDetailDialogData {
  course: CourseResponse;
  onChanged: () => void;
}

@Component({
  selector: 'app-course-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './course-detail-dialog.html',
  styleUrl: './course-detail-dialog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CourseDetailDialog {
  private readonly dialogRef = inject(MatDialogRef<CourseDetailDialog>);
  private readonly router = inject(Router);
  private readonly confirmation = inject(ConfirmationService);
  private readonly courseService = inject(CourseService);
  readonly data = inject<CourseDetailDialogData>(MAT_DIALOG_DATA);

  course = this.data.course;

  close(): void {
    this.dialogRef.close();
  }

  formatLevel(level: string): string {
    if (level === 'BEGINNER') return 'Beginner';
    if (level === 'INTERMEDIATE') return 'Intermediate';
    if (level === 'ADVANCED') return 'Advanced';
    return level;
  }

  editCourse(): void {
    this.dialogRef.close();
    void this.router.navigate(['/trainer/courses/edit', this.course.id]);
  }

  viewStudents(): void {
    this.dialogRef.close();
    void this.router.navigate(['/trainer/courses', this.course.id, 'students']);
  }

  publishCourse(): void {
    const title = this.course.title;

    this.confirmation
      .confirm({
        title: 'Publish this course?',
        message: `Publish "${title}" and make it visible to learners on the platform?`,
        confirmLabel: 'Publish',
        cancelLabel: 'Cancel',
        tone: 'primary',
        icon: 'publish',
        action: () => this.courseService.publishCourse(this.course.id),
        successMessage: `Course "${title}" published successfully.`,
        errorFallback: 'Failed to publish course.',
      })
      .subscribe({
        next: (response) => {
          this.course = response.data;
          this.data.onChanged();
        },
      });
  }

  deleteCourse(): void {
    const title = this.course.title;

    this.confirmation
      .confirm({
        title: 'Delete this course?',
        message: `Delete "${title}" permanently? Chapters, lessons and enrollments linked to it may be affected. This cannot be undone.`,
        confirmLabel: 'Delete course',
        cancelLabel: 'Cancel',
        tone: 'danger',
        icon: 'delete_forever',
        action: () => this.courseService.deleteCourse(this.course.id),
        successMessage: `Course "${title}" deleted successfully.`,
        errorFallback: 'Failed to delete course.',
      })
      .subscribe({
        next: () => {
          this.data.onChanged();
          this.dialogRef.close({ deleted: true, id: this.course.id });
        },
      });
  }
}
