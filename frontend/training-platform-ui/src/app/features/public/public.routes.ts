import { Routes } from '@angular/router';
import { PublicLayout } from '../../layouts/public-layout/public-layout';
import { PublicCourseDetails } from './pages/course-details/course-details';
import { Home } from './pages/home/home';
import { PublicCourses } from './pages/courses/courses';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'courses',
        component: PublicCourses,
      },
      {
        path: 'courses/:id',
        component: PublicCourseDetails,
      },
    ],
  },
];
