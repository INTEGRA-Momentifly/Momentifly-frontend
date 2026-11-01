import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { Reminders } from './pages/reminders/reminder';
import { Home } from './pages/home/home';
import { Social } from './pages/social/social';
import { Fitness } from './pages/fitness/fitness';
import { Calendar } from './pages/calendar/calendar';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: Tasks },
  { path: 'reminders', component: Reminders },
  { path: 'calendar', component: Calendar },
  { path: 'fitness', component: Fitness },
  { path: 'social', component: Social },
];
