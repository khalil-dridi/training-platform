import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarLabel } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error';

export interface NotificationSnackbarData {
  message: string;
  type: NotificationType;
  icon: string;
}

@Component({
  selector: 'app-notification-snackbar',
  standalone: true,
  imports: [MatIconModule, MatSnackBarLabel],
  template: `
    <div class="tp-notification" [class]="'tp-notification--' + data.type" role="status">
      <mat-icon class="tp-notification__icon" aria-hidden="true">{{ data.icon }}</mat-icon>
      <span matSnackBarLabel class="tp-notification__message">{{ data.message }}</span>
    </div>
  `,
  styleUrl: './notification-snackbar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationSnackbar {
  readonly data = inject<NotificationSnackbarData>(MAT_SNACK_BAR_DATA);
}
