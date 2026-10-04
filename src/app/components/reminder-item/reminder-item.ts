import { Component, Input } from '@angular/core';
import { Reminder } from '../../models/reminder.model';

@Component({
  selector: 'app-reminder-item',
  styleUrl: './reminder-item.css',
  templateUrl: './reminder-item.html',
})
export class ReminderItem {
  @Input() reminder!: Reminder;

  formatDueDate(dateValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);

    if (this.isToday(date)) {
      return 'AZI';
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
    };

    if (date.getFullYear() !== new Date().getFullYear()) {
      options.year = 'numeric';
    }

    return new Intl.DateTimeFormat('en-GB', options)
      .format(date)
      .toUpperCase();
  }

  private isToday(date: Date): boolean {
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }
}
