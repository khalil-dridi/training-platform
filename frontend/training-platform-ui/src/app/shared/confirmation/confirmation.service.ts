import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, Observable } from 'rxjs';

import { ConfirmDialog } from './confirm-dialog';
import {
  ConfirmDialogConfig,
  ConfirmDialogData,
  ConfirmDialogResult,
} from './confirm-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private readonly dialog = inject(MatDialog);

  /**
   * Ouvre une confirmation moderne, exécute l'action après validation,
   * gère loading + toasts, et émet le résultat API en cas de succès.
   */
  confirm<T>(config: ConfirmDialogConfig<T>): Observable<T> {
    const data: ConfirmDialogData<T> = {
      title: config.title,
      message: config.message,
      confirmLabel: config.confirmLabel ?? 'Confirm',
      cancelLabel: config.cancelLabel ?? 'Cancel',
      tone: config.tone ?? 'primary',
      icon: config.icon ?? this.defaultIcon(config.tone ?? 'primary'),
      action: config.action,
      successMessage: config.successMessage,
      errorFallback: config.errorFallback,
    };

    const dialogRef = this.dialog.open<
      ConfirmDialog,
      ConfirmDialogData<T>,
      ConfirmDialogResult<T> | undefined
    >(ConfirmDialog, {
      data,
      width: '28rem',
      maxWidth: '92vw',
      autoFocus: 'dialog',
      restoreFocus: true,
      panelClass: ['tp-confirm-panel', `tp-confirm-panel--${data.tone}`],
    });

    return dialogRef.afterClosed().pipe(
      filter((result): result is ConfirmDialogResult<T> => result?.ok === true),
      map((result) => result.data)
    );
  }

  private defaultIcon(tone: ConfirmDialogConfig['tone']): string {
    switch (tone) {
      case 'danger':
        return 'delete_forever';
      case 'warning':
        return 'warning_amber';
      default:
        return 'help_outline';
    }
  }
}
