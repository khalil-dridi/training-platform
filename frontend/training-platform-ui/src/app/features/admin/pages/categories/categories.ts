import { Component, inject, OnInit } from '@angular/core';

import { CategoryResponse } from '../../models/category-response.model';
import { CategoryService } from '../../services/category';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,RouterLink ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {

  private readonly categoryService = inject(CategoryService);

  categories: CategoryResponse[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Failed to load categories', error);
      },
    });
  }
  deleteCategory(id: number): void {
  this.categoryService.deleteCategory(id).subscribe({
    next: () => {
      this.categories = this.categories.filter(
        category => category.id !== id
      );
    },
    error: (error) => {
      console.error('Failed to delete category', error);
    },
  });
}
}