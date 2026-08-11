import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  InstructorRequestResponse,
  InstructorRequestStatus,
} from '../../models/instructor-request-response.model';
import { PageResponse } from '../../models/page-response.model';
import { InstructorRequestService } from '../../services/instructor-request';
import { UserResponse } from '../../../user/models/user-response.model';

@Component({
  selector: 'app-instructor-requests',
  standalone: true,
  imports: [DatePipe, NgClass, MatButtonModule, MatIconModule],
  templateUrl: './instructor-requests.html',
  styleUrl: './instructor-requests.scss',
})
export class InstructorRequests implements OnInit {
  private readonly instructorRequestService = inject(InstructorRequestService);

  requests: InstructorRequestResponse[] = [];
  loading = true;

  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  selectedStatus: InstructorRequestStatus | undefined;

  ngOnInit(): void {
    this.loadRequests();
  }

  filterByStatus(status: InstructorRequestStatus | undefined): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadRequests();
  }

  displayName(user: UserResponse): string {
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  }

  userInitials(user: UserResponse): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || '?';
  }

  formatStatus(status: InstructorRequestStatus): string {
    if (status === 'PENDING') return 'Pending';
    if (status === 'APPROVED') return 'Approved';
    if (status === 'REJECTED') return 'Rejected';
    return status;
  }

  statusBadgeClass(status: InstructorRequestStatus): Record<string, boolean> {
    return {
      'admin-list__badge--pending': status === 'PENDING',
      'admin-list__badge--approved': status === 'APPROVED',
      'admin-list__badge--rejected': status === 'REJECTED',
    };
  }

  approveRequest(id: number): void {
    this.instructorRequestService.approveRequest(id).subscribe({
      next: (response) => {
        this.updateRequestInList(response.data);
      },
      error: (error) => {
        console.error('Failed to approve instructor request', error);
      },
    });
  }

  rejectRequest(id: number): void {
    const confirmed = confirm('Are you sure you want to reject this instructor request?');

    if (!confirmed) {
      return;
    }

    this.instructorRequestService.rejectRequest(id).subscribe({
      next: (response) => {
        this.updateRequestInList(response.data);
      },
      error: (error) => {
        console.error('Failed to reject instructor request', error);
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadRequests();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadRequests();
    }
  }

  private loadRequests(): void {
    this.loading = true;

    this.instructorRequestService
      .getAllRequests(this.selectedStatus, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          const page: PageResponse<InstructorRequestResponse> = response.data;

          this.requests = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load instructor requests', error);
          this.loading = false;
        },
      });
  }

  private updateRequestInList(updatedRequest: InstructorRequestResponse): void {
    this.requests = this.requests.map((request) =>
      request.id === updatedRequest.id ? updatedRequest : request
    );
  }
}
