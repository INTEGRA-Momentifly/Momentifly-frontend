import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/subscriptions';

  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.baseUrl);
  }

  createSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(this.baseUrl, subscription);
  }
}
