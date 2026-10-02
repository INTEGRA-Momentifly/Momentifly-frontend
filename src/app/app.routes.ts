import { Routes } from '@angular/router';
import { Tasks } from './pages/tasks/tasks';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: Tasks },
];
