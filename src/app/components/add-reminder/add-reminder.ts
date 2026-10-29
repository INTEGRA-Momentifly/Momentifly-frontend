import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReminderService } from '../../services/reminder.service';
import { Reminder } from '../../models/reminder.model';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-add-reminder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './add-reminder.html',
  styleUrl: './add-reminder.css'
})
export class AddReminderComponent {
  private reminderService = inject(ReminderService);
  private fb = inject(FormBuilder);

  @Input() displayModal = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() reminderAdded = new EventEmitter<Reminder>();

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

  hideDialog(): void {
    this.reminderForm.reset({ recurrence: 'NONE' });
    this.errorMessage.set(null);
    this.closeModal.emit();
  }

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
        this.reminderAdded.emit(addedReminder);
        this.hideDialog();
      },
      error: (error) => {
        console.error('Failed to add reminder:', error);
        this.errorMessage.set(
          'A apărut o eroare la adăugarea reminderului. Te rugăm să încerci din nou.'
        );
      },
    });
  }
}
