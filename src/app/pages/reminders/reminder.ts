import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReminderList } from '../../components/reminder-list/reminder-list';
import { Reminder } from '../../models/reminder.model';
import { ReminderService } from '../../services/reminder.service';


import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-reminders',
  imports: [
    CommonModule,
    ReminderList,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './reminder.html',
  styleUrl: './reminder.css',
})
export class Reminders implements OnInit {
  private reminderService = inject(ReminderService);
  private fb = inject(FormBuilder);

  reminders = signal<Reminder[]>([]);
  loading = signal(true);

  displayAddModal = signal(false);
  errorMessage = signal<string | null>(null);

  recurrenceOptions = [
    { label: 'Niciuna (Ocazional)', value: 'NONE' },
    { label: 'Săptămânal', value: 'WEEKLY' },
    { label: 'Lunar', value: 'MONTHLY' },
    { label: 'Anual', value: 'YEARLY' },
  ];

  reminderForm: FormGroup = this.fb.group({
    description: ['', Validators.required],
    reminderDate: ['', Validators.required],
    recurrence: ['NONE', Validators.required],
  });

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
        this.errorMessage.set('Eroare la încărcarea reminderelor.');
      },
    });
  }

  get activeReminderCount(): number {
    return this.reminders().filter((reminder) => !reminder.done).length;
  }


  showDialog(): void {
    this.reminderForm.reset({ recurrence: 'NONE' });
    this.errorMessage.set(null);
    this.displayAddModal.set(true);
  }

  hideDialog(): void {
    this.displayAddModal.set(false);
  }

  // Funcția apelată la submit
  onSubmit(): void {
    if (this.reminderForm.invalid) {
      this.reminderForm.markAllAsTouched();
      return;
    }

    const newReminder: Partial<Reminder> = {
      ...this.reminderForm.value,
      done: false,
      userId: '1',
    };

    this.reminderService.addReminder(newReminder).subscribe({
      next: (addedReminder) => {
        this.reminders.update((current) => [...current, addedReminder]);
        this.hideDialog();
      },
      error: (error) => {
        console.error('Failed to add reminder:', error);
        this.errorMessage.set(
          'A apărut o eroare la adăugarea reminderului. Te rugăm să încerci din nou.',
        );
      },
    });
  }
}
