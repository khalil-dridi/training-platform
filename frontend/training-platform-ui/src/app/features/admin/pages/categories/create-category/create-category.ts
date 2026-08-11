import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CategoryService } from '../../../services/category';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './create-category.html',
  styleUrl: './create-category.scss',
})
export class CreateCategory {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  imageTouched = false;

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedImage = input.files[0];
    this.imageTouched = true;
    this.imagePreviewUrl = URL.createObjectURL(this.selectedImage);
  }

  cancel(): void {
    void this.router.navigate(['/admin/categories']);
  }

  onSubmit(): void {
    this.imageTouched = true;

    if (this.categoryForm.invalid || !this.selectedImage) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.categoryForm.getRawValue();

    this.categoryService.createCategory(name, description, this.selectedImage).subscribe({
      next: () => {
        void this.router.navigate(['/admin/categories']);
      },
      error: (error) => {
        console.error('Failed to create category', error);
      },
    });
  }
}
