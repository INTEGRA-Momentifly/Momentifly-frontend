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

    this.subscriptionService.createSubscription(this.subscriptionForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.subscriptionCreated.emit();
        this.closePopup();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'A apărut o eroare. Te rugăm să încerci din nou.';
        console.error('Error creating subscription:', err);
      },
    });
  }

  closePopup() {
    this.close.emit();
  }
}
