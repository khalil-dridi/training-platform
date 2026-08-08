import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category';


@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss',
})
export class EditCategory implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  private categoryId!: number;

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  selectedImage: File | null = null;

  ngOnInit(): void {
    this.categoryId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadCategory();
  }

  private loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (response) => {
        const category = response.data;

        this.categoryForm.patchValue({
          name: category.name,
          description: category.description,
        });
      },
      error: (error) => {
        console.error('Failed to load category', error);
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
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
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Failed to update category', error);
        },
      });
  }
}