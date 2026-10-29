import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { FitnessObjectives } from '../models/objective.model';

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/objectives';

  getObjectives(): Observable<FitnessObjectives | null> {
    return this.http.get<FitnessObjectives | null>(this.baseUrl).pipe(
      catchError((error: HttpErrorResponse) =>
        error.status === 404 ? of(null) : throwError(() => error),
      ),
    );
  }

  saveObjectives(data: FitnessObjectives): Observable<FitnessObjectives> {
    return this.http.post<FitnessObjectives>(this.baseUrl, data);
  }
}
