import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category';


@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  onSubmit(): void {

    if (this.categoryForm.invalid || !this.selectedImage) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.categoryForm.getRawValue();

    this.categoryService
      .createCategory(name, description, this.selectedImage)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Failed to create category', error);
        },
      });
  }
}