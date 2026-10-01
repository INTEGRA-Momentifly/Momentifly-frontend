import { Injectable, inject } from '@angular/core';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient); // I can now make http requests
  private baseUrl = 'http://localhost:8080/tasks';

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }
}
