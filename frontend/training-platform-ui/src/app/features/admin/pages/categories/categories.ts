import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmationService } from '../../../../shared/confirmation/confirmation.service';
import { CategoryResponse } from '../../models/category-response.model';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly confirmation = inject(ConfirmationService);

  categories: CategoryResponse[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;

    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load categories', error);
        this.loading = false;
      },
    });
  }

  deleteCategory(id: number, name: string): void {
    this.confirmation
      .confirm({
        title: `Delete "${name}"?`,
        message:
          'This category will be permanently removed. Courses linked to it may be affected. This action cannot be undone.',
        confirmLabel: 'Delete category',
        cancelLabel: 'Cancel',
        tone: 'danger',
        icon: 'delete_forever',
        action: () => this.categoryService.deleteCategory(id),
        successMessage: `Category "${name}" deleted successfully.`,
        errorFallback: 'Failed to delete category.',
      })
      .subscribe({
        next: () => {
          this.categories = this.categories.filter((category) => category.id !== id);
        },
      });
  }
}
