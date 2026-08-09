import { UserResponse } from '../../user/models/user-response.model';

export interface InstructorRequestResponse {
  id: number;
  user: UserResponse;
  cvUrl: string;
  status: InstructorRequestStatus;
  adminComment: string | null;
  createdAt: string;
  updatedAt: string;
}

export type InstructorRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';