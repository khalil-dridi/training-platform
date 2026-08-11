import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { UserService } from '../../../user/services/user.service';
import { UserResponse } from '../../../user/models/user-response.model';
import { UpdateProfileRequest } from '../../models/update-profile-request.model';
import { ChangePasswordRequest } from '../../models/change-password-request.model';
import { CurrentUserService } from '../../../../core/services/current-user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly currentUserService = inject(CurrentUserService);

  user: UserResponse | null = null;
  selectedAvatar: File | null = null;
  avatarPreviewUrl: string | null = null;

  profileForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [Validators.pattern(/^[0-9]{8}$/)]],
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  displayName(user: UserResponse): string {
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  }

  userInitials(user: UserResponse): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || 'AD';
  }

  passwordsMismatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();
    return Boolean(confirmPassword) && newPassword !== confirmPassword;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedAvatar = input.files[0];
    this.avatarPreviewUrl = URL.createObjectURL(this.selectedAvatar);
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const request: UpdateProfileRequest = this.profileForm.getRawValue();

    this.userService.updateProfile(request).subscribe({
      next: (response) => {
        this.user = response.data;
        this.currentUserService.setUser(response.data);
      },
      error: (error) => {
        console.error('Failed to update profile', error);
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid || this.passwordsMismatch()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const request: ChangePasswordRequest = this.passwordForm.getRawValue();

    this.userService.changePassword(request).subscribe({
      next: () => {
        this.passwordForm.reset();
      },
      error: (error) => {
        console.error('Failed to change password', error);
      },
    });
  }

  uploadAvatar(): void {
    if (!this.selectedAvatar) {
      return;
    }

    this.userService.uploadAvatar(this.selectedAvatar).subscribe({
      next: (response) => {
        this.user = response.data;
        this.currentUserService.setUser(response.data);
        this.avatarPreviewUrl = response.data.avatarUrl;
        this.selectedAvatar = null;
      },
      error: (error) => {
        console.error('Failed to upload avatar', error);
      },
    });
  }

  deleteAvatar(): void {
    this.userService.deleteAvatar().subscribe({
      next: (response) => {
        this.user = response.data;
        this.currentUserService.setUser(response.data);
        this.avatarPreviewUrl = null;
        this.selectedAvatar = null;
      },
      error: (error) => {
        console.error('Failed to delete avatar', error);
      },
    });
  }

  private loadProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.user = response.data;
        this.avatarPreviewUrl = response.data.avatarUrl;

        this.profileForm.patchValue({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone ?? '',
        });
      },
      error: (error) => {
        console.error('Failed to load profile', error);
      },
    });
  }
}
