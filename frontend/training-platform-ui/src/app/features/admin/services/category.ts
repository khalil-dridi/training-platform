import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CategoryResponse } from '../models/category-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/categories`;

  getAllCategories() {
    return this.http.get<ApiResponse<CategoryResponse[]>>(
      this.apiUrl
    );
  }

  getCategoryById(id: number) {
    return this.http.get<ApiResponse<CategoryResponse>>(
      `${this.apiUrl}/${id}`
    );
  }

  createCategory(
    name: string,
    description: string,
    image: File
  ) {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    return this.http.post<ApiResponse<CategoryResponse>>(
      this.apiUrl,
      formData
    );
  }

  updateCategory(
    id: number,
    name: string,
    description: string,
    image?: File
  ) {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    return this.http.put<ApiResponse<CategoryResponse>>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  deleteCategory(id: number) {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${id}`
    );
  }
}