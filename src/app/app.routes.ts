import { Routes } from '@angular/router';
import { Reminders } from './pages/reminders/reminder';
import {Friendships} from './pages/friendships/friendship';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'reminders', component: Reminders },
  { path: 'friendships', component: Friendships},
];
