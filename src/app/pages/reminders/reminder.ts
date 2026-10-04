import { Component } from '@angular/core';
import { ReminderList } from '../../components/reminder-list/reminder-list';
import { Reminder } from '../../models/reminder.model';

@Component({
  selector: 'app-reminders',
  imports: [ReminderList],
  templateUrl: './reminder.html',
  styleUrl: './reminder.css',
})
export class Reminders {
  reminders: Reminder[] = [
    {
      id: '1',
      userId: 'user-1',
      description: 'Hidratare',
      reminderDate: '2026-10-04',
      recurrence: 'NONE',
      done: false,
    },
    {
      id: '2',
      userId: 'user-1',
      description: 'Spring',
      reminderDate: '2026-10-05',
      recurrence: 'WEEKLY',
      done: false,
    },
    {
      id: '3',
      userId: 'user-1',
      description: 'Done',
      reminderDate: '2026-10-03',
      recurrence: 'NONE',
      done: true,
    },
  ];

   get activeReminderCount(): number {
      return this.reminders.filter(reminder => !reminder.done).length;
    }
}
