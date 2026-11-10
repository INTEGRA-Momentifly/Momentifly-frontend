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
  loadingIds = signal<Set<string>>(new Set());

  completedCount = computed(() => {
    return this.quests().filter(
      quest => this.completedIds().has(quest.id)
    ).length;
  });
  progress = computed(() => {
    const total = this.quests().length;
    return total === 0 ? 0 : (this.completedCount() / total) * 100;
  });

  ngOnInit() {
    this.questService.getAll().subscribe({
      next: (data) => {
        this.quests.set(data);

        this.loadCompletedQuests();
      },
      error: (err) => {
        console.error('Error fetching quests:', err);
        this.quests.set([]);
      }
    });
  }

  private loadCompletedQuests() {
    this.questService.getCompletedQuests().subscribe({
      next: (ids) => {
        this.completedIds.set(new Set(ids));
      },
      error: (err) => {
        console.error('Error loading completed quests:', err);
      }
    });
  }

  isDone(id: string): boolean {
    return this.completedIds().has(id);
  }

  isLoading(id: string): boolean {
    return this.loadingIds().has(id);
  }

  toggle(id: string) {

    if (this.isDone(id) || this.isLoading(id)) {
      return;
    }

    const nextLoading = new Set(this.loadingIds());
    nextLoading.add(id);
    this.loadingIds.set(nextLoading);

    this.questService.completeQuest(id).subscribe({
      next: (response) => {
        const nextCompleted = new Set(this.completedIds());
        nextCompleted.add(id);
        this.completedIds.set(nextCompleted);

        this.removeLoading(id);
      },
      error: (err) => {
        console.error('Error completing quest:', err);
        this.removeLoading(id);
      }
    });
  }

  private removeLoading(id: string) {
    const next = new Set(this.loadingIds());
    next.delete(id);
    this.loadingIds.set(next);
  }
}
