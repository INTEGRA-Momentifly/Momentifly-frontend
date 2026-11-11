import { Subscription } from '../models/subscription.model';
import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SubscriptionService{
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/subscriptions';
}
