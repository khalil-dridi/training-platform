import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EnrollmentService } from '../../../services/enrollment';
import { StudentDetails } from '../../courses/student-details/student-details';
import { StudentDetailsDialogData } from '../../courses/student-details/student-details-dialog-data.model';
import { TrainerStudentResponse } from '../../models/trainer-student-response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatIconModule,RouterLink],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students implements OnInit {
  private readonly enrollmentService = inject(EnrollmentService);
  private readonly dialog = inject(MatDialog);

  students: TrainerStudentResponse[] = [];
  filteredStudents: TrainerStudentResponse[] = [];
  searchQuery = '';
  loading = true;

  ngOnInit(): void {
    this.loadStudents();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.trim().toLowerCase();
    this.applyFilter();
  }

  studentInitials(student: TrainerStudentResponse): string {
    const parts = student.learnerName.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return `${first}${last}`.toUpperCase() || '?';
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

  private loadStudents(): void {
    this.loading = true;

    this.enrollmentService.getMyStudents().subscribe({
      next: (response) => {
        this.students = response.data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load students', error);
        this.loading = false;
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
