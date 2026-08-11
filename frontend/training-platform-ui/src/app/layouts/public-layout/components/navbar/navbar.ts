import { DOCUMENT } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class PublicNavbar implements OnDestroy {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  readonly isMobileOpen = signal(false);
  readonly isScrolled = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeMobileNav());

    effect(() => {
      this.document.body.style.overflow = this.isMobileOpen() ? 'hidden' : '';
    });
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 4);
  }

  toggleMobileNav(): void {
    this.isMobileOpen.update((open) => !open);
  }

  closeMobileNav(): void {
    this.isMobileOpen.set(false);
  }

  goToCourses(event: Event): void {
    event.preventDefault();
    this.closeMobileNav();

    const onHome = this.router.url === '/' || this.router.url.startsWith('/#');

    if (onHome) {
      document.getElementById('featured-courses')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    this.router.navigate(['/'], { fragment: 'featured-courses' });
  }

  goToHome(event: Event): void {
    event.preventDefault();
    this.closeMobileNav();

    if (this.router.url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.router.navigate(['/']);
  }
}
