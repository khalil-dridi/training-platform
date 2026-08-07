import { Injectable, signal } from '@angular/core';
import { UserResponse } from '../../features/user/models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  readonly user = signal<UserResponse | null>(null);

  setUser(user: UserResponse): void {
    this.user.set(user);
  }

  clear(): void {
    this.user.set(null);
  }
}