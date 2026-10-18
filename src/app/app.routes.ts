import { Routes } from '@angular/router';
import { Reminders } from './pages/reminders/reminder';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';

// all routes to all pages should be added here in the end (except login + register)
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'reminders', component: Reminders, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
