import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CategoryResponse } from '../../../models/category-response.model';
import { CategoryService } from '../../../services/category';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss',
})
export class EditCategory implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  private categoryId!: number;

  category: CategoryResponse | null = null;

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategory();
  }

  private loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.data;
        this.imagePreviewUrl = response.data.imageUrl;

        this.categoryForm.patchValue({
          name: response.data.name,
          description: response.data.description,
        });
      },
      error: (error) => {
        console.error('Failed to load category', error);
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedImage = input.files[0];
    this.imagePreviewUrl = URL.createObjectURL(this.selectedImage);
  }

  cancel(): void {
    void this.router.navigate(['/admin/categories']);
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.categoryForm.getRawValue();

    this.categoryService
      .updateCategory(
        this.categoryId,
        name,
        description,
        this.selectedImage ?? undefined
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Failed to update category', error);
        },
      });
  }
}
