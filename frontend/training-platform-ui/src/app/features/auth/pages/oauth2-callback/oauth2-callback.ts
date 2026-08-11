import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  template: `<p>Connexion en cours...</p>`
})
export class OAuth2Callback implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  ngOnInit(): void {

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/learn/dashboard']);
      return;
    }

    this.tokenService.saveToken(token);

    this.router.navigate(['/login']);
  }

}