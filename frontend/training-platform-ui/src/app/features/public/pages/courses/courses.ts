import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-courses',
  standalone: true,
  template: '',
})
export class PublicCourses implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.router.navigate(['/'], {
      fragment: 'featured-courses',
      replaceUrl: true,
    });
  }
}
