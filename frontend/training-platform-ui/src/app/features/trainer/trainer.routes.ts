import { Routes } from '@angular/router';
import { TrainerLayout } from '../../layouts/trainer-layout/trainer-layout';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Courses } from './pages/courses/courses';
import { Profile } from './pages/profile/profile';
import { CreateCourse } from './pages/courses/create-course/create-course';
import { EditCourse } from './pages/courses/edit-course/edit-course';
import { CourseContent } from './pages/courses/course-content/course-content';
import { CreateChapter } from './pages/courses/course-content/create-chapter/create-chapter';
import { EditChapter } from './pages/courses/course-content/edit-chapter/edit-chapter';
import { CreateLesson } from './pages/courses/course-content/create-lesson/create-lesson';
import { EditLesson } from './pages/courses/course-content/edit-lesson/edit-lesson';

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
          {
        path: 'courses',
        component: Courses,
      },
          {
        path: 'profile',
        component: Profile,
      },
      {
  path: 'courses/create',
  component: CreateCourse,
},
{
  path: 'courses/edit/:id',
  component: EditCourse,
},
{
  path: 'courses/:courseId/content',
  component: CourseContent,
},
{
  path: 'courses/:courseId/content/create-chapter',
  component: CreateChapter,
},
{
  path: 'courses/:courseId/content/edit-chapter/:id',
  component: EditChapter,
},
{
  path: 'courses/:courseId/content/chapter/:chapterId/create-lesson',
  component: CreateLesson,
},
{
  path: 'courses/:courseId/content/chapter/:chapterId/edit-lesson/:id',
  component: EditLesson,
},
        ],
  },
];