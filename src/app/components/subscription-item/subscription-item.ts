import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subscription} from '../../models/subscription.model';

@Component({
  selector: 'app-subscription-item',
  imports: [CommonModule],
  templateUrl:'./subscription-item.html',
  styleUrl:'./subscription-item.css'
})

export class SubscriptionItem{
  @Input({ required: true }) subscription!: Subscription

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
    if (diffInDays === null) return this.subscription.endDate;

    if (diffInDays === 0) return 'Astăzi';
    if (diffInDays === 1) return 'Mâine';
    if (diffInDays === -1) return 'Ieri';

    const targetDate = new Date(this.subscription.endDate);
    return targetDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  }

//   isUrgent(): boolean {
//     if(!this.subscription.endDate) {
//       return false;
//     }
//
//     const dateText = this.subscription.endDate.toLowerCase();
//
//     if(dateText.includes("mâine") || dateText.includes("azi")) {
//       return true;
//     }
//
//     const targetDate = new Date(this.subscription.endDate);
//     const today = new Date();
//     const diffInDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
//
//     return diffInDays >= 0 && diffInDays <= 3; // Urgent dacă expiră în 0-3 zile
//   }
}
