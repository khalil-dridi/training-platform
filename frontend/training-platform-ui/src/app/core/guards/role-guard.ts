import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '../services/current-user';

export const roleGuard: CanActivateFn = (route) => {

  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  const user = currentUserService.user();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];

  if (user.role === requiredRole) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};