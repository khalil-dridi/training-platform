import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CurrentUserService } from '../../../../core/services/current-user';
import { RecommendationItem } from '../../models/recommendation.model';
import { RecommendationService } from '../../services/recommendation.service';

type RecommendationViewState = 'loading' | 'ready' | 'empty' | 'error' | 'unavailable';

@Component({
  selector: 'app-recommendation-list',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './recommendation-list.html',
  styleUrl: './recommendation-list.scss',
})
export class RecommendationList implements OnInit {
  private readonly recommendationService = inject(RecommendationService);
  private readonly currentUserService = inject(CurrentUserService);

  recommendations: RecommendationItem[] = [];
  viewState: RecommendationViewState = 'loading';
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    const learnerId = this.currentUserService.user()?.id;

    if (!learnerId) {
      this.recommendations = [];
      this.viewState = 'unavailable';
      this.errorMessage = 'Recommendations are unavailable right now.';
      return;
    }

    this.viewState = 'loading';
    this.errorMessage = null;

    this.recommendationService.getRecommendations(learnerId, 5).subscribe({
      next: (response) => {
        this.recommendations = response.recommendations ?? [];

        if (this.recommendations.length === 0) {
          this.viewState = 'empty';
          return;
        }

        this.viewState = 'ready';
      },
      error: (error) => {
        console.error('Failed to load recommendations', error);
        this.recommendations = [];
        this.viewState = 'error';
        this.errorMessage = 'Unable to load recommendations at the moment.';
      },
    });
  }

  formatLevel(level: string): string {
    if (!level) {
      return '';
    }

    return level.charAt(0) + level.slice(1).toLowerCase();
  }
}
