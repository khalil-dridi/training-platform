import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NotificationService } from '../../../../shared/notifications/notification.service';
import { RegisterRequest } from '../../models/register-request.model';
import { AuthService } from '../../services/auth-service';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';
type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

function passwordRulesValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  if (!value) {
    return null;
  }

  const errors: ValidationErrors = {};

  if (value.length < 8) {
    errors['minlength'] = true;
  }
  if (!/[A-Z]/.test(value)) {
    errors['uppercase'] = true;
  }
  if (!/[a-z]/.test(value)) {
    errors['lowercase'] = true;
  }
  if (!/[0-9]/.test(value)) {
    errors['digit'] = true;
  }

  return Object.keys(errors).length ? errors : null;
}

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  if (!confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  readonly registerForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, passwordRulesValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator }
  );

  submitState: SubmitState = 'idle';
  passwordVisible = false;
  confirmPasswordVisible = false;

  readonly passwordRules = [
    { key: 'minlength', label: 'Au moins 8 caractères' },
    { key: 'uppercase', label: 'Une lettre majuscule' },
    { key: 'lowercase', label: 'Une lettre minuscule' },
    { key: 'digit', label: 'Un chiffre' },
  ] as const;

  get isSubmitting(): boolean {
    return this.submitState === 'loading';
  }

  get passwordValue(): string {
    return this.registerForm.controls.password.value;
  }

  get passwordStrength(): PasswordStrengthLevel {
    const value = this.passwordValue;
    if (!value) {
      return 'empty';
    }

    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 1) return 'weak';
    if (score === 2) return 'fair';
    if (score === 3) return 'good';
    return 'strong';
  }

  get passwordStrengthLabel(): string {
    switch (this.passwordStrength) {
      case 'weak':
        return 'Faible';
      case 'fair':
        return 'Moyen';
      case 'good':
        return 'Bon';
      case 'strong':
        return 'Fort';
      default:
        return '';
    }
  }

  isPasswordRuleMet(ruleKey: string): boolean {
    const value = this.passwordValue;
    if (!value) {
      return false;
    }

    switch (ruleKey) {
      case 'minlength':
        return value.length >= 8;
      case 'uppercase':
        return /[A-Z]/.test(value);
      case 'lowercase':
        return /[a-z]/.test(value);
      case 'digit':
        return /[0-9]/.test(value);
      default:
        return false;
    }
  }

  isFieldValid(controlName: 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.registerForm.controls[controlName];
    if (!control.value || control.invalid) {
      return false;
    }

    if (controlName === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return false;
    }

    return control.touched || control.dirty;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.notification.warning(this.resolveValidationMessage());
      return;
    }

    const { confirmPassword: _confirmPassword, ...request } =
      this.registerForm.getRawValue();

    this.submitState = 'loading';

    this.authService.register(request as RegisterRequest).subscribe({
      next: () => {
        this.submitState = 'success';
        this.notification.success(
          'Compte créé avec succès. Vérifiez votre email pour activer votre compte.'
        );
        window.setTimeout(() => {
          this.router.navigate(['/login']);
        }, 900);
      },
      error: (error: unknown) => {
        this.submitState = 'error';
        this.notification.error(this.resolveRegisterErrorMessage(error));
        this.resetSubmitStateSoon();
      },
    });
  }

  private resolveValidationMessage(): string {
    const form = this.registerForm;

    if (form.hasError('passwordMismatch')) {
      return 'Les mots de passe ne correspondent pas.';
    }

    if (form.controls.password.errors) {
      return 'Le mot de passe ne respecte pas toutes les règles de sécurité.';
    }

    if (form.controls.email.hasError('email')) {
      return 'Veuillez saisir une adresse email valide.';
    }

    return 'Veuillez corriger les champs du formulaire avant de continuer.';
  }

  private resolveRegisterErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message;
      if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
        return apiMessage;
      }

      if (error.status === 409) {
        return 'Un compte existe déjà avec cet email.';
      }

      if (error.status === 0) {
        return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      }
    }

    return "L'inscription a échoué. Veuillez réessayer.";
  }

  private resetSubmitStateSoon(): void {
    window.setTimeout(() => {
      if (this.submitState === 'error') {
        this.submitState = 'idle';
      }
    }, 1600);
  }
}
