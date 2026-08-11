import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning';

export interface NotificationSnackbarData {
  message: string;
  type: NotificationType;
  icon: string;
}

@Component({
  selector: 'app-notification-snackbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatSnackBarLabel],
  template: `
    <div
      class="tp-notification"
      [class]="'tp-notification--' + data.type"
      [attr.role]="data.type === 'error' ? 'alert' : 'status'"
      aria-live="polite"
    >
      <span class="tp-notification__accent" aria-hidden="true"></span>

      <span class="tp-notification__icon-wrap" aria-hidden="true">
        <mat-icon class="tp-notification__icon">{{ data.icon }}</mat-icon>
      </span>

      <span matSnackBarLabel class="tp-notification__message">{{ data.message }}</span>

      <button
        mat-icon-button
        type="button"
        class="tp-notification__close"
        aria-label="Fermer la notification"
        (click)="dismiss()"
      >
        <mat-icon aria-hidden="true">close</mat-icon>
      </button>
    </div>
  `,
  styleUrl: './notification-snackbar.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationSnackbar {
  readonly data = inject<NotificationSnackbarData>(MAT_SNACK_BAR_DATA);
  private readonly snackBarRef = inject(MatSnackBarRef<NotificationSnackbar>);

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
