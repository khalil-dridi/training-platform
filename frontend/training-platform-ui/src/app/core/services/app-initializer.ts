import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TokenService } from '../../features/auth/services/token.service';
import { UserService } from '../../features/user/services/user.service';
import { CurrentUserService } from './current-user';

@Injectable({
  providedIn: 'root',
})
export class AppInitializer {

  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly currentUserService = inject(CurrentUserService);

  async initialize(): Promise<void> {

  if (!this.tokenService.hasToken()) {
    return;
  }

  try {

    const response = await firstValueFrom(
      this.userService.getCurrentUser()
    );

    this.currentUserService.setUser(response.data);

  } catch (error) {

    this.tokenService.removeToken();
    this.currentUserService.clear();

  }

}

}