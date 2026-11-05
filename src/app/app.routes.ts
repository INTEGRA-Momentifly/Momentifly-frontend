import { Routes } from '@angular/router';
import {FoodLogList} from './components/food-log-list/food-log-list';

export const routes: Routes = [
  { path: '', redirectTo: 'food_log', pathMatch: 'full' },
  { path: 'food_log', component: FoodLogList},
];
