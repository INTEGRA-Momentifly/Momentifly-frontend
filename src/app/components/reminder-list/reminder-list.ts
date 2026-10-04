import { Component, Input } from '@angular/core';
import { ReminderItem } from '../reminder-item/reminder-item';
import { Reminder } from '../../models/reminder.model';

@Component({
  imports: [ReminderItem],
  selector: 'app-reminder-list',
  styleUrl: './reminder-list.css',
  templateUrl: './reminder-list.html',
})
export class ReminderList {
  @Input() reminders: Reminder[] = [];

  get pendingReminders(): Reminder[] {
    return this.reminders.filter((reminder) => !reminder.done);
  }
}
