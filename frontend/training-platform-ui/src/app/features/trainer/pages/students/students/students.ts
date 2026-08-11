import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService } from '../../../../../shared/notifications/notification.service';
import { EnrollmentService } from '../../../services/enrollment';
import { StudentDetails } from '../../courses/student-details/student-details';
import { StudentDetailsDialogData } from '../../courses/student-details/student-details-dialog-data.model';
import {
  StudentCourseResponse,
  TrainerStudentResponse,
} from '../../models/trainer-student-response.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students implements OnInit {
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  students: TrainerStudentResponse[] = [];
  filteredStudents: TrainerStudentResponse[] = [];
  searchQuery = '';
  loading = true;

  ngOnInit(): void {
    this.loadStudents();
  }

  get totalStudents(): number {
    return this.students.length;
  }

  get totalEnrollments(): number {
    return this.students.reduce((sum, student) => sum + student.courses.length, 0);
  }

  get completedEnrollments(): number {
    return this.students.reduce(
      (sum, student) => sum + student.courses.filter((course) => course.completed).length,
      0
    );
  }

  get inProgressEnrollments(): number {
    return Math.max(this.totalEnrollments - this.completedEnrollments, 0);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.trim().toLowerCase();
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilter();
  }

  studentInitials(student: TrainerStudentResponse): string {
    const parts = student.learnerName.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return `${first}${last}`.toUpperCase() || '?';
  }

  courseCountLabel(count: number): string {
    return count === 1 ? '1 course' : `${count} courses`;
  }

  openStudentDetails(courseId: number, learnerId: number): void {
    this.dialog.open(StudentDetails, {
      data: { courseId, learnerId } satisfies StudentDetailsDialogData,
      panelClass: 'trainer-student-details-dialog',
      maxWidth: '560px',
      width: 'calc(100% - 2rem)',
      autoFocus: false,
    });
  }

  trackStudent(_index: number, student: TrainerStudentResponse): number {
    return student.learnerId;
  }

  trackCourse(_index: number, course: StudentCourseResponse): number {
    return course.enrollmentId;
  }

  private loadStudents(): void {
    this.loading = true;

    this.enrollmentService.getMyStudents().subscribe({
      next: (response) => {
        this.students = response.data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        this.notification.errorFromHttp(error, 'Failed to load students.');
        console.error('Failed to load students', error);
      },
    });
  }

  private applyFilter(): void {
    if (!this.searchQuery) {
      this.filteredStudents = [...this.students];
      return;
    }

    this.filteredStudents = this.students.filter((student) => {
      const nameMatch = student.learnerName.toLowerCase().includes(this.searchQuery);
      const emailMatch = student.learnerEmail.toLowerCase().includes(this.searchQuery);
      const courseMatch = student.courses.some((course) =>
        course.courseTitle.toLowerCase().includes(this.searchQuery)
      );

      return nameMatch || emailMatch || courseMatch;
    });
  }
}
