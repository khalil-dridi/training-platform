import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  InstructorRequestResponse,
  InstructorRequestStatus,
} from '../../models/instructor-request-response.model';
import { PageResponse } from '../../models/page-response.model';
import { InstructorRequestService } from '../../services/instructor-request';

@Component({
  selector: 'app-instructor-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-requests.html',
  styleUrl: './instructor-requests.scss',
})
export class InstructorRequests implements OnInit {

  private readonly instructorRequestService = inject(
    InstructorRequestService
  );

  requests: InstructorRequestResponse[] = [];

  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadRequests();
  }

  private loadRequests(): void {
    this.instructorRequestService
      .getAllRequests(
        undefined,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (response) => {
          const page: PageResponse<InstructorRequestResponse> =
            response.data;

          this.requests = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
        },
        error: (error) => {
          console.error(
            'Failed to load instructor requests',
            error
          );
        },
      });
  }
  approveRequest(id: number): void {
  this.instructorRequestService.approveRequest(id).subscribe({
    next: (response) => {
      const updatedRequest = response.data;

      this.requests = this.requests.map(request =>
        request.id === updatedRequest.id
          ? updatedRequest
          : request
      );
    },
    error: (error) => {
      console.error('Failed to approve instructor request', error);
    },
  });
}

rejectRequest(id: number): void {
  this.instructorRequestService.rejectRequest(id).subscribe({
    next: (response) => {
      const updatedRequest = response.data;

      this.requests = this.requests.map(request =>
        request.id === updatedRequest.id
          ? updatedRequest
          : request
      );
    },
    error: (error) => {
      console.error('Failed to reject instructor request', error);
    },
  });
}

selectedStatus: InstructorRequestStatus | undefined;

filterByStatus(status: InstructorRequestStatus | undefined): void {
  this.selectedStatus = status;
  this.currentPage = 0;

  this.instructorRequestService
    .getAllRequests(
      this.selectedStatus,
      this.currentPage,
      this.pageSize
    )
    .subscribe({
      next: (response) => {
        const page: PageResponse<InstructorRequestResponse> =
          response.data;

        this.requests = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
      },
      error: (error) => {
        console.error(
          'Failed to filter instructor requests',
          error
        );
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
}