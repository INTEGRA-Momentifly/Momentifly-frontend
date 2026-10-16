import { Injectable, computed, inject, signal } from '@angular/core';

const STORAGE_KEY = 'momentifly-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private encoded = signal<string | null>(sessionStorage.getItem(STORAGE_KEY));

  isLoggedIn = computed(() => this.encoded() !== null);

  setCredentials(username: string, password: string) {
    const value = btoa(`${username}:${password}`);
    sessionStorage.setItem(STORAGE_KEY, value);
    this.encoded.set(value);
  }

  clear() {
    // for logout, later
    sessionStorage.removeItem(STORAGE_KEY);
    this.encoded.set(null);
  }

  authHeader(): string | null {
    const value = this.encoded();
    return value ? `Basic ${value}` : null;
  }
}
