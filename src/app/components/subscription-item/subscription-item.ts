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

// Verifică dacă data este urgentă (ex: scrie "Mâine" sau este foarte aproape)
  isUrgent(): boolean {
    if(!this.subscription.endDate) {
      return false;
    }

    const dateText = this.subscription.endDate.toLowerCase();

    if(dateText.includes("mâine") || dateText.includes("azi")) {
      return true;
    }

    const targetDate = new Date(this.subscription.endDate);
    const today = new Date();
    const diffInDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

    return diffInDays >= 0 && diffInDays <= 3; // Urgent dacă expiră în 0-3 zile
  }
}
