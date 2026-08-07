import { Routes } from '@angular/router';
import { TrainerLayout } from '../../layouts/trainer-layout/trainer-layout';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { Dashboard } from './pages/dashboard/dashboard';

export const TRAINER_ROUTES: Routes = [
  {
    path: 'trainer',
    component: TrainerLayout,
    canActivate: [authGuard, roleGuard],
    data: {
  role: 'TRAINER'
},
    children: [
          {
            path: 'dashboard',
            component: Dashboard,
          },
        ],
  },
];