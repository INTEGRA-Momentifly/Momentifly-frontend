import { Injectable, inject } from '@angular/core';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/tasks';

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  updateTaskStatus(taskId: string | number, isCompleted: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${taskId}`, { completed: isCompleted });
  }
}
