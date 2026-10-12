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
  allDone = computed(
    () => this.quests().length > 0 && this.completedCount() === this.quests().length,
  );

  ngOnInit() {
    this.quests.set([
      { id: '1', description: 'Log breakfast', points: 10 },
      { id: '2', description: 'Complete 3 tasks', points: 25 },
      { id: '3', description: 'Drink 2L water', points: 15 },
      { id: '4', description: '30 min activity', points: 10 },
    ]);
    this.questService.getAll().subscribe((data) => this.quests.set(data));
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
