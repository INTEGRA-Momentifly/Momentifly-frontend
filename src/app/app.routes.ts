import { Routes } from '@angular/router';
import { Reminders } from './pages/reminders/reminder';
import { Tasks } from './pages/tasks/tasks';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'reminders', component: Reminders },
  { path: 'tasks', component: Tasks },
];
