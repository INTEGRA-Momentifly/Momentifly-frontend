import { Component, OnInit, inject, signal } from '@angular/core';
import { ReminderList } from '../../components/reminder-list/reminder-list';
import { Reminder } from '../../models/reminder.model';
import { ReminderService } from '../../services/reminder.service';

@Component({
  selector: 'app-reminders',
  imports: [ReminderList],
  templateUrl: './reminder.html',
  styleUrl: './reminder.css',
})
export class Reminders implements OnInit {
  private reminderService = inject(ReminderService);

  reminders = signal<Reminder[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.reminderService.getReminders().subscribe({
      next: (reminders: Reminder[]) => {
        this.reminders.set(reminders);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Failed to load reminders:', error);
        this.loading.set(false);
      },
    });
  }

  get activeReminderCount(): number {
    return this.reminders().filter((reminder) => !reminder.done).length;
  }
}
