import { Component, Input, input, signal } from '@angular/core';
import { ReminderItem } from '../reminder-item/reminder-item';
import { Reminder } from '../../models/reminder.model';

@Component({
  imports: [ReminderItem],
  selector: 'app-reminder-list',
  styleUrl: './reminder-list.css',
  templateUrl: './reminder-list.html',
})

export class ReminderList {
  reminders = input<Reminder[]>([]);
  loading = input(false);

  get pendingReminders(): Reminder[] {
    return this.reminders().filter((reminder) => !reminder.done);
  }
}
