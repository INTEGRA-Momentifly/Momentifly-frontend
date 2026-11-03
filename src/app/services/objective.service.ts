import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { FitnessObjectives } from '../models/objective.model';
import { toObjectives } from '../utils/objectives.utils';

export const OBJECTIVES_API_CONFIG = {
  baseUrl: 'http://localhost:8080/api/objectives',
  userId: '00000000-0000-0000-0000-000000000001',
};

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  private http = inject(HttpClient);

  get(): Observable<FitnessObjectives | null> {
    return this.http
      .get<unknown>(OBJECTIVES_API_CONFIG.baseUrl, { params: { userId: OBJECTIVES_API_CONFIG.userId } })
      .pipe(
        map(toObjectives),
        catchError((error: HttpErrorResponse) => (error.status === 404 ? of(null) : throwError(() => error))),
      );
  }

  create(objectives: FitnessObjectives): Observable<FitnessObjectives | null> {
    return this.http.post<unknown>(this.userUrl(), objectives).pipe(map(toObjectives));
  }

  update(objectives: FitnessObjectives): Observable<FitnessObjectives | null> {
    return this.http.put<unknown>(this.userUrl(), objectives).pipe(map(toObjectives));
  }

  private userUrl(): string {
    return `${OBJECTIVES_API_CONFIG.baseUrl}/${OBJECTIVES_API_CONFIG.userId}`;
  }
}
