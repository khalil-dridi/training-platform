import { Routes } from '@angular/router';
import { LearnerLayout } from '../../layouts/learner-layout/learner-layout';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Courses } from './pages/courses/courses';
import { CourseDetails } from './pages/courses/course-details/course-details';
import { Learning } from './pages/learning/learning';
import { MyCourses } from './pages/my-courses/my-courses';
import { Profile } from './pages/profile/profile';

export const LEARNER_ROUTES: Routes = [
  {
    path: 'learner',
    component: LearnerLayout,
    canActivate: [authGuard, roleGuard],
    data: {
      role: 'LEARNER',
    },
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'courses',
        component: Courses,
      },
      {
        path: 'courses/:id',
        component: CourseDetails,
      },
      {
        path: 'courses/:courseId/learn',
        component: Learning,
      },
      {
        path: 'my-courses',
        component: MyCourses,
      },
      {
        path: 'profile',
        component: Profile,
      },
    ],
  },
];
