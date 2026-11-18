import { Component, LOCALE_ID, inject, signal, OnInit, computed } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { forkJoin } from 'rxjs';

import { AppointmentTimelineComponent } from '../../components/appointment-timeline/appointment-timeline';
import { QuestList } from '../../components/quest-list/quest-list';
import { TaskList } from '../../components/task-list/task-list';
import { QuestService } from '../../services/quest.service';

registerLocaleData(localeRo);

@Component({
  imports: [DatePipe, AppointmentTimelineComponent, QuestList, TaskList],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
  providers: [{ provide: LOCALE_ID, useValue: 'ro-RO' }],
})
export class Home implements OnInit {
  private taskService = inject(TaskService);
  private questService = inject(QuestService);

  today = new Date();

  // --- Tasks ---
  tasks = signal<Task[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  todayTasks = computed(() => {
    const todayKey = this.toDateKey(new Date());
    return this.tasks().filter((task) => task.dueDate === todayKey);
  });

  // --- Weekly score ---
  currentScore = signal<number | null>(null);
  lastWeekScore = signal<number | null>(null);
  scoreLoading = signal(true);
  scoreError = signal(false);
  streak = this.questService.streak;
  streakLoading = signal(true);
  streakError = signal(false);

  scoreDifference = computed(() => {
    const current = this.currentScore();
    const previous = this.lastWeekScore();

    if (current === null || previous === null) {
      return null;
    }

    return current - previous;
  });

  ngOnInit() {
    this.loadTasks();
    this.loadWeeklyScore();
    this.loadStreak();
  }

  private loadTasks() {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Nu s-au putut încărca task-urile.');
        this.loading.set(false);
      },
    });
  }

  private loadWeeklyScore() {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);

    previousDate.setDate(previousDate.getDate() - 7);

    const currentDateParam = this.formatLocalDateTime(currentDate);
    const previousDateParam = this.formatLocalDateTime(previousDate);

    forkJoin({
      current: this.questService.getWeekScore(currentDateParam),
      previous: this.questService.getWeekScore(previousDateParam),
    }).subscribe({
      next: (result) => {
        this.currentScore.set(result.current);
        this.lastWeekScore.set(result.previous);
        this.scoreLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading weekly scores:', err);
        this.scoreError.set(true);
        this.scoreLoading.set(false);
      },
    });
  }

  private toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatLocalDateTime(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private loadStreak() {
    this.questService.getStreak().subscribe({
      next: (streak) => {
        this.questService.streak.set(streak);
        this.streakLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading current streak:', err);
        this.streakError.set(true);
        this.streakLoading.set(false);
      },
    });
  }
}
