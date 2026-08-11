import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '../notifications/notification.service';
import {
  ConfirmDialogData,
  ConfirmDialogResult,
} from './confirm-dialog.model';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialog {
  private readonly dialogRef = inject(
    MatDialogRef<ConfirmDialog, ConfirmDialogResult | undefined>
  );
  private readonly notification = inject(NotificationService);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  readonly loading = signal(false);

  cancel(): void {
    if (this.loading()) {
      return;
    }
    this.dialogRef.close(undefined);
  }

  confirm(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.dialogRef.disableClose = true;

    this.data.action().subscribe({
      next: (response) => {
        this.notification.success(this.data.successMessage);
        this.dialogRef.disableClose = false;
        this.dialogRef.close({ ok: true, data: response });
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.dialogRef.disableClose = false;
        this.notification.errorFromHttp(error, this.data.errorFallback);
      },
    });
  }
}
