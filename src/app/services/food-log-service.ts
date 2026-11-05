import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FoodLogService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/food_log';
}
