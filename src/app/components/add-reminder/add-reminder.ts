
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReminderService } from '../../services/reminder.service';
import { AuthService } from '../../services/auth.service';
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
  private authService = inject(AuthService);
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

    this.errorMessage.set(null);

    this.authService.getCurrentUser().subscribe({
      next: (user: any) => {
        const newReminder: Partial<Reminder> = {
          description: this.reminderForm.value.description,
          reminderDate: this.reminderForm.value.reminderDate + 'T00:00:00',
          recurrence: this.reminderForm.value.recurrence,
          userId: user.id,
          done: false,
        };

        this.reminderService.addReminder(newReminder).subscribe({
          next: (addedReminder) => {
            this.reminderAdded.emit(addedReminder);
            this.hideDialog();
          },
          error: (error) => {
            console.error('Failed to add reminder:', error);
            this.errorMessage.set('Failed to add reminder.');
          },
        });
      },
      error: (error) => {
        console.error('Failed to get current user:', error);
        this.errorMessage.set(
          'Could not identify the current user.'
        );
      },
    });
  }
}
