import { Component, inject, OnInit } from '@angular/core';

import { UserService } from '../../../user/services/user.service';
import { UserResponse } from '../../../user/models/user-response.model';
import { UpdateProfileRequest } from '../../models/update-profile-request.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangePasswordRequest } from '../../models/change-password-request.model';
import { CurrentUserService } from '../../../../core/services/current-user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly currentUserService = inject(CurrentUserService);
  user: UserResponse | null = null;

  profileForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    phone: ['', [Validators.pattern(/^[0-9]{8}$/)]],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.user = response.data;

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

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const request: UpdateProfileRequest =
      this.profileForm.getRawValue();

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

  passwordForm = this.fb.nonNullable.group({
  currentPassword: ['', [Validators.required]],
  newPassword: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', [Validators.required]],
});

changePassword(): void {
  if (this.passwordForm.invalid) {
    this.passwordForm.markAllAsTouched();
    return;
  }

  const request: ChangePasswordRequest =
    this.passwordForm.getRawValue();

  this.userService.changePassword(request).subscribe({
    next: () => {
      this.passwordForm.reset();

      console.log('Password changed successfully');
    },
    error: (error) => {
      console.error('Failed to change password', error);
    },
  });
}

selectedAvatar: File | null = null;

onAvatarSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  this.selectedAvatar = input.files[0];
}

uploadAvatar(): void {
  if (!this.selectedAvatar) {
    return;
  }

  this.userService.uploadAvatar(this.selectedAvatar).subscribe({
    next: (response) => {
  this.user = response.data;
  this.currentUserService.setUser(response.data);
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
},
    error: (error) => {
      console.error('Failed to delete avatar', error);
    },
  });
}
}