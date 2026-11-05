import { Component, signal } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Sidebar} from 'primeng/sidebar';
import {ButtonDirective} from 'primeng/button';

@Component({
  imports: [RouterOutlet, Sidebar, RouterLinkActive, ButtonDirective, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('momentifly');
}
