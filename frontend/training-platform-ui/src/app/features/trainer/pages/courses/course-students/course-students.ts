import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EnrollmentService } from '../../../services/enrollment';
import { EnrollmentResponse } from '../../models/enrollment-response.model';
import { StudentDetails } from '../student-details/student-details';
import { StudentDetailsDialogData } from '../student-details/student-details-dialog-data.model';

@Component({
  selector: 'app-course-students',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './course-students.html',
  styleUrl: './course-students.scss',
})
export class CourseStudents implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly dialog = inject(MatDialog);

  courseId!: number;
  enrollments: EnrollmentResponse[] = [];
  filteredEnrollments: EnrollmentResponse[] = [];
  searchQuery = '';
  loading = true;

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadStudents();
  }

  courseTitle(): string {
    return this.enrollments[0]?.courseTitle ?? 'Course Students';
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.trim().toLowerCase();
    this.applyFilter();
  }

  learnerInitials(enrollment: EnrollmentResponse): string {
    const parts = enrollment.learnerName.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return `${first}${last}`.toUpperCase() || '?';
  }

  openStudentDetails(learnerId: number): void {
    this.dialog.open(StudentDetails, {
      data: { courseId: this.courseId, learnerId } satisfies StudentDetailsDialogData,
      panelClass: 'trainer-student-details-dialog',
      maxWidth: '560px',
      width: 'calc(100% - 2rem)',
      autoFocus: false,
    });
  }

  private loadStudents(): void {
    this.loading = true;

    this.enrollmentService.getCourseEnrollments(this.courseId).subscribe({
      next: (response) => {
        this.enrollments = response.data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load course students', error);
        this.loading = false;
      },
    });
  }

  private applyFilter(): void {
    if (!this.searchQuery) {
      this.filteredEnrollments = [...this.enrollments];
      return;
    }

    this.filteredEnrollments = this.enrollments.filter((enrollment) =>
      enrollment.learnerName.toLowerCase().includes(this.searchQuery)
    );
  }
}
