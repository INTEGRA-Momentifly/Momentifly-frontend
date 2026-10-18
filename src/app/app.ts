import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ButtonDirective } from 'primeng/button';
import { Sidebar } from 'primeng/sidebar';
import { AuthService } from './services/auth.service';

@Component({
  imports: [ButtonDirective, RouterLink, RouterLinkActive, RouterOutlet, Sidebar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  protected readonly title = signal('momentifly');
  protected readonly isAuthPage = signal(false);

  constructor() {
    this.updateAuthPage(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateAuthPage(event.urlAfterRedirects));
  }

  private updateAuthPage(url: string) {
    this.isAuthPage.set(url === '/login' || url === '/register');
  }

  logout() {
    this.authService.clear();
    this.router.navigateByUrl('/login');
  }
}
