import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-create-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-subscription.html',
  styleUrls: ['./create-subscription.css'],
})
export class CreateSubscriptionComponent {
  @Output() close = new EventEmitter<void>();
  @Output() subscriptionCreated = new EventEmitter<void>();

  subscriptionForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
  ) {
    this.subscriptionForm = this.fb.group({
      name: ['', Validators.required],
      cost: [null, [Validators.required, Validators.min(0)]],
      endDate: [''],
    });
  }

  onSubmit() {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const subscriptionData = this.subscriptionForm.value;

    this.subscriptionService.createSubscription(subscriptionData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.subscriptionCreated.emit();
        this.closePopup();
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 0) {
          this.errorMessage = 'Nu ne putem conecta la server. Verifică conexiunea la internet!';
        } else if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'A apărut o eroare la salvarea abonamentului. Te rugăm să încerci din nou.';
        }

        console.error('Eroare la crearea abonamentului:', err);
      },
    });
  }
  closePopup() {
    this.close.emit();
  }
}
