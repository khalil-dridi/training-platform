import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class PublicFooter {
  private readonly router = inject(Router);

  goToCourses(event: Event): void {
    event.preventDefault();

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      document.getElementById('featured-courses')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    this.router.navigate(['/'], { fragment: 'featured-courses' });
  }
}
