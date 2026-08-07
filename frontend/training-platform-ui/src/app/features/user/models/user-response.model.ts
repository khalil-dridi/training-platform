export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  enabled: boolean;
}