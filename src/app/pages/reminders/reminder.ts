import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
    private cdr = inject(ChangeDetectorRef);

    reminders: Reminder[] = [];
    loading = true;

    ngOnInit(): void {
      this.reminderService.getReminders().subscribe({
        next: (reminders: Reminder[]) => {
          console.log('BACKEND:', reminders);

          this.reminders = reminders;
          this.loading = false;

          console.log('LOADING:', this.loading);
          console.log('REMINDERS:', this.reminders);

          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error('FAILED:', error);

          this.loading = false;

          this.cdr.detectChanges();
        },
      });
    }

    get activeReminderCount(): number {
      return this.reminders.filter((reminder) => !reminder.done).length;
    }
  }
