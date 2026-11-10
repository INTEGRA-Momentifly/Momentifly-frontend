import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { Reminders } from './pages/reminders/reminder';
import {Friendships} from './pages/friendships/friendship';
import { Home } from './pages/home/home';
import { Social } from './pages/social/social';
import { Fitness } from './pages/fitness/fitness';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Logout } from './pages/logout/logout';
import { authGuard, logoutGuard } from './guards/auth.guard';
import {CalendarItem} from './components/calendar-item/calendar-item';

// all routes to all pages should be added here in the end (except login + register)
export const routes: Routes = [
  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'tasks', component: Tasks, canActivate: [authGuard] },
  { path: 'reminders', component: Reminders, canActivate: [authGuard] },
  { path: 'friendships', component: Friendships, canActivate: [authGuard] },
  { path: 'calendar', component: CalendarItem, canActivate: [authGuard] },
  { path: 'fitness', component: Fitness, canActivate: [authGuard] },
  { path: 'social', component: Social, canActivate: [authGuard] },
  { path: 'logout', component: Logout, canActivate: [logoutGuard] },
  { path: '**', redirectTo: 'login' },
];
