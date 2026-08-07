import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { PUBLIC_ROUTES } from './features/public/public.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';
import { TRAINER_ROUTES } from './features/trainer/trainer.routes';
import { LEARNER_ROUTES } from './features/learner/learner.routes';

export const routes: Routes = [
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...ADMIN_ROUTES,
  ...TRAINER_ROUTES,
  ...LEARNER_ROUTES,
];