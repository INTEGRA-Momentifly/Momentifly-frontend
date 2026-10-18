import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
const STORAGE_KEY = 'momentifly-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private encoded = signal<string | null>(sessionStorage.getItem(STORAGE_KEY));
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users/me';

  isLoggedIn = computed(() => this.encoded() !== null);

  setCredentials(username: string, password: string) {
    const value = btoa(`${username}:${password}`);
    sessionStorage.setItem(STORAGE_KEY, value);
    this.encoded.set(value);
  }

  login(username: string, password: string) {
    this.setCredentials(username, password); // stored first, so the interceptor can attach them
    return this.http.get<User>(this.baseUrl).pipe(
      // might need to get and store the id somewhere
      // where post for register to create the user
      catchError((err) => {
        this.clear(); // wrong credentials, undo the storing
        return throwError(() => err);
      }),
    );
  }

  clear() {
    // for logout
    sessionStorage.removeItem(STORAGE_KEY);
    this.encoded.set(null);
  }

  authHeader(): string | null {
    const value = this.encoded();
    return value ? `Basic ${value}` : null;
  }
}
