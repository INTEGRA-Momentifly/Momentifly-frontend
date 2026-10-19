import { Injectable, inject } from '@angular/core';
import { Reminder } from '../models/reminder.model';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/reminder';

  getReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(this.baseUrl);
  }
}
