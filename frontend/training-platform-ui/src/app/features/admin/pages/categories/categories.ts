import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    const confirmed = confirm(`Are you sure you want to delete "${name}"?`);

    if (!confirmed) {
      return;
    }

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter((category) => category.id !== id);
      },
      error: (error) => {
        console.error('Failed to delete category', error);
      },
    });
  }
}
