import { Routes } from '@angular/router';
import { Reminders } from './pages/reminders/reminder';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'reminders', component: Reminders },
<<<<<<< HEAD
=======
  { path: 'tasks', component: Tasks },
  { path: '**', redirectTo: 'login' },
>>>>>>> ebd2ef6 (ticket-65: made login + register form)
];
