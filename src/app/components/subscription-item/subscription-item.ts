import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from '../../models/subscription.model';

@Component({
  selector: 'app-subscription-item',
  imports: [CommonModule],
  templateUrl: './subscription-item.html',
  styleUrl: './subscription-item.css'
})
export class SubscriptionItem {
  @Input({ required: true }) subscription!: Subscription;
  @Output() toggleAutoRenewal = new EventEmitter<Subscription>();

  private getDaysDifference(): number | null {
    if (!this.subscription.endDate) return null;

    const targetDate = new Date(this.subscription.endDate);
    if (isNaN(targetDate.getTime())) return null;

    const today = new Date();
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 3600 * 24));
  }

  isUrgent(): boolean {
    const diffInDays = this.getDaysDifference();
    if (diffInDays === null) return false;
    return diffInDays >= 0 && diffInDays <= 3;
  }

  getFormattedDate(): string {
    const diffInDays = this.getDaysDifference();

    if (diffInDays === 0) return 'Astăzi';
    if (diffInDays === 1) return 'Mâine';
    if (this.isExpired) {
      return 'Expirat';
    }
    if (!this.subscription.endDate) return '';

    const targetDate = new Date(this.subscription.endDate);
    return targetDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  }

  get isExpired(): boolean {
    if (!this.subscription?.endDate) return false;
    const timestamp = new Date(this.subscription.endDate).getTime();
    return !isNaN(timestamp) && timestamp < Date.now();
  }

  onToggleClick(): void {
    if (this.isExpired) return;
    this.toggleAutoRenewal.emit(this.subscription);
  }
}
