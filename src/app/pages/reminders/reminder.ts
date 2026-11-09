import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderList } from '../../components/reminder-list/reminder-list';
import { AddReminderComponent } from '../../components/add-reminder/add-reminder';
import { Reminder } from '../../models/reminder.model';
import { ReminderService } from '../../services/reminder.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [
    CommonModule,
    ReminderList,
    AddReminderComponent,
    ButtonModule,
  ],
  templateUrl: './reminder.html',
  styleUrl: './reminder.css',
})
export class Reminders implements OnInit {
  private reminderService = inject(ReminderService);

  reminders = signal<Reminder[]>([]);
  loading = signal(true);
  displayAddModal = signal(false);

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
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

  showDialog(): void {
    this.displayAddModal.set(true);
  }

  hideDialog(): void {
    this.displayAddModal.set(false);
  }

  onReminderAdded(newReminder: Reminder): void {
    this.reminders.update((current) => [...current, newReminder]);
  }
}
