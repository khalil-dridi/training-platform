import { Routes } from '@angular/router';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
    ],
  },
];