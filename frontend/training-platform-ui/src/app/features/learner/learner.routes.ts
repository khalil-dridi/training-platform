import { Routes } from '@angular/router';
import { LearnerLayout } from '../../layouts/learner-layout/learner-layout';

export const LEARNER_ROUTES: Routes = [
  {
    path: 'learner',
    component: LearnerLayout,
    children: [],
  },
];