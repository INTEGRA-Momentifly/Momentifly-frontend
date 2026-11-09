import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { CreateUser, User } from '../models/user.model';
const STORAGE_KEY = 'momentifly-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private credentials = signal<string | null>(sessionStorage.getItem(STORAGE_KEY));
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users';

  isLoggedIn = computed(() => true);

  setCredentials(username: string, password: string) {
    const value = btoa(`${username}:${password}`);
    sessionStorage.setItem(STORAGE_KEY, value);
    this.credentials.set(value);
  }

  login(username: string, password: string) {
    this.setCredentials(username, password); // stored first, so the interceptor can attach them
    return this.http.get<User>(this.baseUrl + '/current').pipe(
      catchError((err) => {
        this.clear(); // wrong credentials, undo the storing
        return throwError(() => err);
      }),
    );
  }

  register(user: CreateUser) {
    return this.http.post<User>(this.baseUrl, user).pipe(
      tap(() => this.setCredentials(user.username, user.password)),
    );
  }

  clear() {
    // for logout
    sessionStorage.removeItem(STORAGE_KEY);
    this.credentials.set(null);
  }

  authHeader(): string | null {
    const value = this.credentials();
    return value ? `Basic ${value}` : null;
  }
}
