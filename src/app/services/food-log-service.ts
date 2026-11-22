import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FoodLog} from '../models/food-log.model';

@Injectable({providedIn: 'root'})
export class FoodLogService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/food_log';

  getFoodLogs(): Observable<FoodLog[]>{
    return this.http.get<FoodLog[]>(this.baseUrl);
  }

  createFoodLog(requestData: any): Observable<FoodLog> {
    return this.http.post<FoodLog>(this.baseUrl, requestData);
  }
}
