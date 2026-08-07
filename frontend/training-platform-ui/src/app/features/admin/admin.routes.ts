import { Routes } from '@angular/router';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard],
    data: {
  role: 'ADMIN'
},
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
    ],
  },
];