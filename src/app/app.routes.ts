import { Routes } from '@angular/router';
import {CalendarItem} from './components/calendar-item/calendar-item';

export const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarItem },
];
