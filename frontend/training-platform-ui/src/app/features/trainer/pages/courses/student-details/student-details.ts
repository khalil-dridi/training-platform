import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EnrollmentService } from '../../../services/enrollment';
import { StudentEnrollmentResponse } from '../../models/student-enrollment-response.model';
import { StudentDetailsDialogData } from './student-details-dialog-data.model';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './student-details.html',
  styleUrl: './student-details.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'trainer-student-details-host',
    '[class.trainer-student-details-host--page]': 'isPageMode',
  },
})
export class StudentDetails implements OnInit {
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly dialogData = inject<StudentDetailsDialogData>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly dialogRef = inject(MatDialogRef<StudentDetails>, { optional: true });
  private readonly enrollmentService = inject(EnrollmentService);

  courseId!: number;
  learnerId!: number;

  student: StudentEnrollmentResponse | null = null;
  loading = true;
  error = false;
  isPageMode = false;

  ngOnInit(): void {
    this.isPageMode = this.dialogRef == null;

    if (this.dialogData) {
      this.courseId = this.dialogData.courseId;
      this.learnerId = this.dialogData.learnerId;
    } else if (this.route) {
      this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
      this.learnerId = Number(this.route.snapshot.paramMap.get('learnerId'));
    }

    this.loadStudent();
  }

  isDialog(): boolean {
    return this.dialogRef != null;
  }

  close(): void {
    this.dialogRef?.close();
  }

  studentInitials(student: StudentEnrollmentResponse): string {
    const parts = student.learnerName.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return `${first}${last}`.toUpperCase() || '?';
  }

  private loadStudent(): void {
    this.loading = true;
    this.error = false;

    this.enrollmentService.getStudentEnrollment(this.courseId, this.learnerId).subscribe({
      next: (response) => {
        this.student = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load student details', err);
        this.loading = false;
        this.error = true;
      },
    });
  }
}
