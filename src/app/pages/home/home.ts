import { Component, LOCALE_ID, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { forkJoin } from 'rxjs';

import { AppointmentTimelineComponent } from '../../components/appointment-timeline/appointment-timeline';
import { QuestList } from '../../components/quest-list/quest-list';
import { QuestService } from '../../services/quest.service';

registerLocaleData(localeRo);

@Component({
  imports: [DatePipe, AppointmentTimelineComponent, QuestList],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
  providers: [{ provide: LOCALE_ID, useValue: 'ro-RO' }],
})
export class Home implements OnInit {
  private questService = inject(QuestService);

  today = new Date();

  currentScore = signal<number | null>(null);
  lastWeekScore = signal<number | null>(null);
  scoreLoading = signal(true);
  scoreError = signal(false);

  scoreDifference = computed(() => {
    const current = this.currentScore();
    const previous = this.lastWeekScore();

    if (current === null || previous === null) {
      return null;
    }

    return current - previous;
  });

  ngOnInit() {
    this.loadWeeklyScore();
  }

  private loadWeeklyScore() {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);

    previousDate.setDate(previousDate.getDate() - 7);

    const currentDateParam = this.formatLocalDateTime(currentDate);
    const previousDateParam = this.formatLocalDateTime(previousDate);

    forkJoin({
      current: this.questService.getWeekScore(currentDateParam),
      previous: this.questService.getWeekScore(previousDateParam)
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
      }
    });
  }

  private formatLocalDateTime(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}
