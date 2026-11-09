import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, concat, last, map, of, switchMap, throwError } from 'rxjs';
import { FitnessObjectives } from '../models/objective.model';
import { toObjectives } from '../utils/objectives.utils';

export const OBJECTIVES_API_URL = 'http://localhost:8080/api/objectives';

export type ObjectiveType = 'CALORIES' | 'PROTEIN' | 'CARBOHYDRATES' | 'FATS';

export interface WriteObjectiveRequest {
  type: ObjectiveType;
  value: number;
}

type ObjectiveResponse = Partial<Record<keyof FitnessObjectives, number | null>>;

export const OBJECTIVE_TYPES: Readonly<Record<keyof FitnessObjectives, ObjectiveType>> = {
  calories: 'CALORIES',
  protein: 'PROTEIN',
  carbohydrates: 'CARBOHYDRATES',
  fats: 'FATS',
};

const FIELDS = Object.keys(OBJECTIVE_TYPES) as (keyof FitnessObjectives)[];

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  private http = inject(HttpClient);

  get(): Observable<FitnessObjectives | null> {
    return this.http.get<unknown>(OBJECTIVES_API_URL).pipe(
      map(toObjectives),
      catchError((error: HttpErrorResponse) => (error.status === 404 ? of(null) : throwError(() => error))),
    );
  }

  create(objectives: FitnessObjectives): Observable<FitnessObjectives | null> {
    return this.save(objectives);
  }

  update(objectives: FitnessObjectives): Observable<FitnessObjectives | null> {
    return this.save(objectives);
  }

  private save(objectives: FitnessObjectives): Observable<FitnessObjectives | null> {
    return this.http.get<ObjectiveResponse | null>(OBJECTIVES_API_URL).pipe(
      switchMap((current) =>
        concat(...FIELDS.map((field) => this.write(field, objectives[field], current?.[field] != null))),
      ),
      last(),
      map(toObjectives),
    );
  }

  private write(field: keyof FitnessObjectives, value: number, exists: boolean): Observable<unknown> {
    const body: WriteObjectiveRequest = { type: OBJECTIVE_TYPES[field], value };
    return exists ? this.http.put<unknown>(OBJECTIVES_API_URL, body) : this.http.post<unknown>(OBJECTIVES_API_URL, body);
  }
}
