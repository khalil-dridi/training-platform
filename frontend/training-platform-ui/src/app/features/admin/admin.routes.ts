import { Routes } from '@angular/router';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Categories } from './pages/categories/categories';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { CreateCategory } from './pages/categories/create-category/create-category';
import { EditCategory } from './pages/categories/edit-category/edit-category';
import { Users } from './pages/users/users';
import { UserDetails } from './pages/users/user-details/user-details';
import { InstructorRequests } from './pages/instructor-requests/instructor-requests';

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
      {
        path: 'categories',
        component: Categories,
      },
        {
          path: 'categories/create',
          component: CreateCategory,
        },
        {
        path: 'categories/edit/:id',
        component: EditCategory,
        },
        {
          path :'users',
          component: Users,
        } , 
        {
          path: 'users/:id',
          component: UserDetails,
        } , 
        {
          path: 'instructor-requests',
          component: InstructorRequests,
        }
      
        
    ],
  },
];