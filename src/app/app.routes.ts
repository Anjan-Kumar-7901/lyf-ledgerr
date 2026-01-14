import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: Login ,
    canActivate: [loginGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'year-wrapped',
    loadComponent: () =>
      import('./year-wrapped/year-wrapped')
        .then((m) => m.yearWrapped),
      canActivate: [authGuard]
  }
];
