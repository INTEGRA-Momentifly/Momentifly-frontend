import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/subscriptions';

  getAllSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.baseUrl);
  }

  getActiveSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}/active`);
  }

  getExpiredSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.baseUrl}/expired`);
  }

  updateAutoRenewal(id: string, autoRenewal: boolean): Observable<Subscription> {
    const params = new HttpParams().set('autoRenewal', String(autoRenewal));
    return this.http.patch<Subscription>(`${this.baseUrl}/${id}/autoRenewal`, null, { params });
  }

  createSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(this.baseUrl, subscription);
  }

}
