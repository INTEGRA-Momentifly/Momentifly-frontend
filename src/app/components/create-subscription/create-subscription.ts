import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SubscriptionService} from '../../services/subscription.service';

@Component({
  selector: 'app-create-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-subscription.html',
  styleUrls: ['./create-subscription.css'],
})
export class CreateSubscriptionComponent {
  @Input() userId: string | null = null;
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
      autoRenewal: [true]
    });
  }

  onSubmit() {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'Nu s-a putut identifica utilizatorul curent.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const raw = this.subscriptionForm.getRawValue();
    const normalizedEndDate = raw.endDate
      ? (raw.endDate.length === 16 ? `${raw.endDate}:00` : raw.endDate)
      : null;

    const subscriptionData = {
      userId: this.userId,
      name: raw.name?.trim(),
      cost: Number(raw.cost),
      autoRenewal: this.isExpired ? false : Boolean(raw.autoRenewal),
      endDate: normalizedEndDate
    };

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

  get isExpired(): boolean {
    const value = this.subscriptionForm.get('endDate')?.value;
    if (!value) return false;
    const timestamp = new Date(value).getTime();
    return !Number.isNaN(timestamp) && timestamp < Date.now();
  }

  closePopup() {
    this.close.emit();
  }

  onEndDateChange(): void {
    const autoRenewalCtrl = this.subscriptionForm.get('autoRenewal');
    if (!autoRenewalCtrl) return;

    if (this.isExpired) {
      autoRenewalCtrl.setValue(false);
      autoRenewalCtrl.disable();
    } else {
      autoRenewalCtrl.enable();
    }
  }
}
