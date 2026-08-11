import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import {
  NotificationSnackbar,
  NotificationSnackbarData,
  NotificationType,
} from './notification-snackbar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['tp-notification-panel'],
  };

  success(
    message: string,
    duration = 4500
  ): MatSnackBarRef<NotificationSnackbar> {
    return this.open({
      message,
      type: 'success',
      icon: 'check_circle',
      duration,
    });
  }

  error(
    message: string,
    duration = 5500
  ): MatSnackBarRef<NotificationSnackbar> {
    return this.open({
      message,
      type: 'error',
      icon: 'error',
      duration,
    });
  }

  warning(
    message: string,
    duration = 5000
  ): MatSnackBarRef<NotificationSnackbar> {
    return this.open({
      message,
      type: 'warning',
      icon: 'warning_amber',
      duration,
    });
  }

  /** Affiche une snackbar d'erreur à partir d'une réponse HTTP. */
  errorFromHttp(
    error: unknown,
    fallback: string,
    duration = 5500
  ): MatSnackBarRef<NotificationSnackbar> {
    return this.error(this.resolveHttpErrorMessage(error, fallback), duration);
  }

  resolveHttpErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message;
      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
        return apiMessage;
      }
    }

    return fallback;
  }

  private open(options: {
    message: string;
    type: NotificationType;
    icon: string;
    duration: number;
  }): MatSnackBarRef<NotificationSnackbar> {
    const data: NotificationSnackbarData = {
      message: options.message,
      type: options.type,
      icon: options.icon,
    };

    return this.snackBar.openFromComponent(NotificationSnackbar, {
      ...this.defaultConfig,
      duration: options.duration,
      data,
      panelClass: [
        'tp-notification-panel',
        `tp-notification-panel--${options.type}`,
      ],
    });
  }
}
