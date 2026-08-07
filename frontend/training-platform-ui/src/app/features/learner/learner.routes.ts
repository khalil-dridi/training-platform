import { Routes } from '@angular/router';
import { LearnerLayout } from '../../layouts/learner-layout/learner-layout';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { Dashboard } from './pages/dashboard/dashboard';


export const LEARNER_ROUTES: Routes = [
  {
    path: 'learner',
    component: LearnerLayout,
    canActivate: [authGuard, roleGuard],
    data: {
  role: 'LEARNER'
},
    children: [
          {
            path: 'dashboard',
            component: Dashboard,
          },
        ],
  },
];