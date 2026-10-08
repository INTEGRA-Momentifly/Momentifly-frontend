import {Component, computed, input, signal} from '@angular/core';
import {Subscription} from '../../models/subscription.model';
import {SubscriptionItem} from '../subscription-item/subscription-item';

@Component({
  selector: 'app-subscription-list',
  imports: [SubscriptionItem],
  styleUrl:'./subscription-list.css',
  templateUrl: './subscription-list.html'

})

export class SubscriptionList{
  subscriptions = input<Subscription[]>([]);

  // dacă vrei să testezi ceva legat de interfață ai aici un sample, doar decomentezi
  // ce-i jos si comentezi ce-i sus
  // subscriptions = signal<Subscription[]>([
  //   { name: 'Adobe CC', cost: 239.99, endDate: '2026-10-13' },
  //   { name: 'Netflix', cost: 45.99, endDate: '2026-10-15' },
  //   { name: 'YouTube Premium', cost: 35.99, endDate: '2026-10-18' },
  //   { name: 'Spotify', cost: 24.99, endDate: '2026-10-25' },
  //   { name: 'Notion', cost: 16.00, endDate: '2026-11-01' },
  //   { name: 'iCloud 200GB', cost: 5.99, endDate: '2026-11-10' }
  // ]);

  totalActiveSubscriptions = computed(() => this.subscriptions().length);

  totalMonthlyExpense = computed(() => {
    const sum = this.subscriptions().reduce((acc, sub) => acc + sub.cost, 0);
    return sum.toFixed(2);
  });

  summaryCards = computed(() => [
    { label: 'ABONAMENTE ACTIVE', value: this.totalActiveSubscriptions(), currency: '' },
    { label: 'TOTAL LUNAR', value: this.totalMonthlyExpense(), currency: 'RON' }
  ]);
}
