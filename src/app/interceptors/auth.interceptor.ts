import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const API_URL = 'http://localhost:8080';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const header = inject(AuthService).authHeader();

  if (!header || !req.url.startsWith(API_URL)) {
    return next(req);
  }

  // requests are immutable, so clone with the extra header
  return next(req.clone({ setHeaders: { Authorization: header } }));
};
