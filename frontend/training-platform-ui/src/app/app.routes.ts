import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/pages/reset-password/reset-password';
import { Register } from './features/auth/pages/register/register';
import { VerifyEmail } from './features/auth/pages/verify-email/verify-email';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'reset-password',
    component: ResetPassword,
  },
  {
  path: 'oauth2/callback',
  loadComponent: () =>
    import('./features/auth/pages/oauth2-callback/oauth2-callback')
      .then(m => m.OAuth2Callback)
},
{
  path: 'register',
  component: Register,
},

{
  path: 'verify-email',
  component: VerifyEmail,
},
];
