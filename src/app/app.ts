import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { QuestList } from './components/quest-list/quest-list';
@Component({
  imports: [ButtonDirective, RouterLink, RouterLinkActive, RouterOutlet, SidebarModule, QuestList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('momentifly');
}
