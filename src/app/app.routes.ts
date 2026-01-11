import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard }
];
