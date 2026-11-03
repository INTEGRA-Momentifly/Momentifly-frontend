import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { Reminders } from './pages/reminders/reminder';
import { Home } from './pages/home/home';
import { Fitness } from './pages/fitness/fitness';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: Tasks },
  { path: 'reminders', component: Reminders },
  { path: 'fitness', component: Fitness },
];
