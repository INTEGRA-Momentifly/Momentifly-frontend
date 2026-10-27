import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Quest } from '../../models/quest.model';
import { QuestService } from '../../services/quest.service';

@Component({
  selector: 'app-quest-list',
  imports: [],
  templateUrl: './quest-list.html',
  styleUrl: './quest-list.css',
})
export class QuestList implements OnInit {
  private questService = inject(QuestService);

  quests = signal<Quest[]>([]);
  completedIds = signal<Set<string>>(new Set());

  completedCount = computed(() => this.completedIds().size);
  progress = computed(() => {
    const total = this.quests().length;
    return total === 0 ? 0 : (this.completedCount() / total) * 100;
  });

  ngOnInit() {
    this.questService.getAll().subscribe({
      next: (data) => {
        this.quests.set(data);
      },
      error: (err) => {
        console.error('Encountered an error while fetching quests:', err);
        this.quests.set([]);
      }
    });
  }

  isDone(id: string) {
    return this.completedIds().has(id);
  }

  toggle(id: string) {
    const next = new Set(this.completedIds());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.completedIds.set(next);
  }
}
