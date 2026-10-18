import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
const STORAGE_KEY = 'momentifly-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private credentials = signal<string | null>(sessionStorage.getItem(STORAGE_KEY));
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users';

  isLoggedIn = computed(() => this.credentials() !== null);

  setCredentials(username: string, password: string) {
    const value = btoa(`${username}:${password}`);
    sessionStorage.setItem(STORAGE_KEY, value);
    this.credentials.set(value);
  }

  login(username: string, password: string) {
    this.setCredentials(username, password); // stored first, so the interceptor can attach them
    return this.http.get<User>(this.baseUrl + '/me').pipe(
      catchError((err) => {
        this.clear(); // wrong credentials, undo the storing
        return throwError(() => err);
      }),
    );
  }

  // post for register to create the user
  // something like:
  // register(username: string, password: string) {
  //   this.setCredentials(username, password);
  //   return this.http.post<User>(this.baseUrl, {
  //     username: username,
  //     password: password,
  //     dailyCalorieGoal: 2000,
  //   });
  // }

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
