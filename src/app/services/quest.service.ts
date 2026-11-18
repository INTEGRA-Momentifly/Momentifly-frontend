
import { Injectable, inject, signal } from '@angular/core';
import { Quest } from '../models/quest.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuestService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/quests';
  streak = signal<number | null>(null);

  getAll(): Observable<Quest[]> {
    return this.http.get<Quest[]>(this.baseUrl);
  }

  completeQuest(questId: string): Observable<any> {
    const params = new HttpParams().set('questId', questId);

    return this.http.post<any>(
      `${this.baseUrl}/completeQuest`,
      null,
      { params }
    );
  }

  getWeekScore(date: string): Observable<number> {
    const params = new HttpParams().set('date', date);

    return this.http.get<number>(
      `${this.baseUrl}/weekScore`,
      { params }
    );
  }

  getCompletedQuests(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/completedQuests`
    );
  }

  getStreak(): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/streak`
    );
  }

  incrementStreak() {
    const currentStreak = this.streak();

    if (currentStreak !== null) {
      this.streak.set(currentStreak + 1);
      return;
    }

    this.getStreak().subscribe({
      next: (streak) => this.streak.set(streak),
      error: (err) => console.error('Error refreshing current streak:', err),
    });
  }
}
