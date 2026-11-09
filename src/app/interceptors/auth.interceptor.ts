import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const API_URL = 'http://localhost:8080';
const REGISTRATION_URL = `${API_URL}/api/users`;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const header = authService.authHeader();
  const isRegistration = req.method === 'POST' && req.url === REGISTRATION_URL;

  const request =
    !header || !req.url.startsWith(API_URL) || isRegistration
      ? req
      : req.clone({ setHeaders: { Authorization: header } });

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        authService.clear();
      }

      return throwError(() => error);
    }),
  );
};
