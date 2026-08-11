import { Observable } from 'rxjs';

export type ConfirmDialogTone = 'danger' | 'primary' | 'warning';

export interface ConfirmDialogConfig<T = unknown> {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmDialogTone;
  icon?: string;
  /** Exécutée au clic sur confirmer ; le dialog gère le loading. */
  action: () => Observable<T>;
  successMessage: string;
  errorFallback: string;
}

export interface ConfirmDialogData<T = unknown> {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone: ConfirmDialogTone;
  icon: string;
  action: () => Observable<T>;
  successMessage: string;
  errorFallback: string;
}

export interface ConfirmDialogResult<T = unknown> {
  ok: true;
  data: T;
}
