import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { Reminders } from './pages/reminders/reminder';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: Tasks },
  { path: 'reminders', component: Reminders },
];
