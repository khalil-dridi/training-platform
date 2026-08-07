import { Routes } from '@angular/router';
import { TrainerLayout } from '../../layouts/trainer-layout/trainer-layout';

export const TRAINER_ROUTES: Routes = [
  {
    path: 'trainer',
    component: TrainerLayout,
    children: [],
  },
];