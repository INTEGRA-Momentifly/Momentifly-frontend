import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Sidebar } from 'primeng/sidebar';

@Component({
  imports: [ButtonDirective, RouterLink, RouterLinkActive, RouterOutlet, Sidebar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('momentifly');
}
