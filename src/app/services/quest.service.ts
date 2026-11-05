import { Injectable, inject } from '@angular/core';
import { Quest } from '../models/quest.model';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuestService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/quests';

  getAll(): Observable<Quest[]> {
    return this.http.get<Quest[]>(this.baseUrl);
  }
}
