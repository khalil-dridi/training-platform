import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CourseLevel } from '../../../trainer/pages/models/course-level.model';
import { CourseResponse } from '../../../trainer/pages/models/course-response.model';
import { CourseService } from '../../services/course';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {
  private readonly courseService = inject(CourseService);
  private readonly route = inject(ActivatedRoute);

  courses: CourseResponse[] = [];
  coursesLoading = false;
  coursesError: string | null = null;
  carouselIndex = 0;
  slidesPerView = 1;

  private pendingCoursesScroll = false;

  ngOnInit(): void {
    this.updateSlidesPerView();
    this.loadCourses();

    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'featured-courses') {
        this.pendingCoursesScroll = true;
        this.scrollToFeaturedCourses();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.pendingCoursesScroll) {
      this.scrollToFeaturedCourses();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSlidesPerView();
    this.clampCarouselIndex();
  }

  loadCourses(): void {
    this.coursesLoading = true;
    this.coursesError = null;

    this.courseService.getPublishedCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.carouselIndex = 0;
        this.coursesLoading = false;
        if (this.pendingCoursesScroll) {
          setTimeout(() => this.scrollToFeaturedCourses(), 100);
        }
      },
      error: (error) => {
        console.error('Failed to load featured courses', error);
        this.courses = [];
        this.coursesLoading = false;
        this.coursesError = 'Unable to load courses.';
      },
    });
  }

  scrollToFeaturedCourses(): void {
    const section = document.getElementById('featured-courses');

    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.pendingCoursesScroll = false;
  }

  scrollToFeaturedFromHero(event: Event): void {
    event.preventDefault();
    this.scrollToFeaturedCourses();
  }

  formatLevel(level: CourseLevel): string {
    const labels: Record<CourseLevel, string> = {
      [CourseLevel.BEGINNER]: 'Beginner',
      [CourseLevel.INTERMEDIATE]: 'Intermediate',
      [CourseLevel.ADVANCED]: 'Advanced',
    };

    return labels[level] ?? level;
  }

  maxCarouselIndex(): number {
    return Math.max(0, this.courses.length - this.slidesPerView);
  }

  canCarouselPrev(): boolean {
    return this.carouselIndex > 0;
  }

  canCarouselNext(): boolean {
    return this.carouselIndex < this.maxCarouselIndex();
  }

  prevSlide(): void {
    if (this.canCarouselPrev()) {
      this.carouselIndex--;
    }
  }

  nextSlide(): void {
    if (this.canCarouselNext()) {
      this.carouselIndex++;
    }
  }

  trackOffsetPercent(): number {
    if (this.courses.length === 0) {
      return 0;
    }

    return (this.carouselIndex * 100) / this.courses.length;
  }

  private updateSlidesPerView(): void {
    const width = window.innerWidth;

    if (width >= 1200) {
      this.slidesPerView = 3;
    } else if (width >= 768) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 1;
    }
  }

  private clampCarouselIndex(): void {
    this.carouselIndex = Math.min(this.carouselIndex, this.maxCarouselIndex());
  }
}
