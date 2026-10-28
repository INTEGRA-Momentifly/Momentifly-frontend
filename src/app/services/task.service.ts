
import { Injectable, inject } from '@angular/core';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type CreateTaskRequest = Pick<
  Task,
  'userId' | 'description' | 'dueDate' | 'difficulty'
>;

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/tasks';

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(
      `${this.baseUrl}/${request.userId}`,
      {
        description: request.description,
        dueDate: request.dueDate,
        difficulty: request.difficulty,
      }
    );
  }
}
