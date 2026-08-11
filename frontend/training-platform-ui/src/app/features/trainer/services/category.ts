import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiResponse } from '../../../core/models/api-response.model';
import { CategoryResponse } from '../../admin/models/category-response.model';
import { environment } from '../../../../environments/environment.development';

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
}