import {Component, computed, input, signal} from '@angular/core';
import {Subscription} from '../../models/subscription.model';
import {SubscriptionItem} from '../subscription-item/subscription-item';
import {mockSubscriptions} from '../../subscriptions-mock';

@Component({
  selector: 'app-subscription-list',
  imports: [SubscriptionItem],
  styleUrl:'./subscription-list.css',
  templateUrl: './subscription-list.html'

})

export class SubscriptionList{
  subscriptions = input<Subscription[]>([]);

  // subscriptions = mockSubscriptions;


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
