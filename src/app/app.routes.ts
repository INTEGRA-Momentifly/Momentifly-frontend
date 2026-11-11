import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { Reminders } from './pages/reminders/reminder';
import {Friendships} from './pages/friendships/friendship';
import { Home } from './pages/home/home';
import { Social } from './pages/social/social';
import { Fitness } from './pages/fitness/fitness';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';
import {CalendarItem} from './components/calendar-item/calendar-item';

// all routes to all pages should be added here in the end (except login + register)
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: Tasks },
  { path: 'reminders', component: Reminders },
  { path: 'friendships', component: Friendships},
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'reminders', component: Reminders, canActivate: [authGuard] },
  // after merge with Tasks UI page on main
  // {path: 'tasks', component: Tasks, canActivate[authGuard]}
  // { path: '**', redirectTo: 'login' },
  { path: 'calendar', component: CalendarItem },
  { path: 'fitness', component: Fitness },
  { path: 'social', component: Social },
];
