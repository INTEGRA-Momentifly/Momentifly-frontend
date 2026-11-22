import {Component, computed, input, output} from '@angular/core';
import {Subscription, SubscriptionFilter} from '../../models/subscription.model';
import {SubscriptionItem} from '../subscription-item/subscription-item';
import {mockSubscriptions} from '../../subscriptions-mock';
import {filter} from 'rxjs';

@Component({
  selector: 'app-subscription-list',
  imports: [SubscriptionItem],
  styleUrl: './subscription-list.css',
  templateUrl: './subscription-list.html'

})

export class SubscriptionList {
  subscriptions = input<Subscription[]>([])
  // subscriptions = mockSubscriptions;
  activeFilter = input<SubscriptionFilter>('ALL');

  filterChange = output<SubscriptionFilter>();
  toggleAutoRenewal = output<Subscription>();

  private isSubscriptionExpired(sub: Subscription): boolean {
    if (!sub.endDate) return false;
    const timestamp = new Date(sub.endDate).getTime();
    return !Number.isNaN(timestamp) && timestamp < Date.now();
  }

  activeOnlySubscriptions = computed(() =>
    this.subscriptions().filter((sub) => !this.isSubscriptionExpired(sub))
  );

  totalActiveSubscriptions = computed(() => this.activeOnlySubscriptions().length);

  totalMonthlyExpense = computed(() => {
    const sum = this.activeOnlySubscriptions().reduce((acc, sub) => acc + (sub.cost ?? 0), 0);
    return sum.toFixed(2);
  });

  summaryCards = computed(() => [
    {label: 'ABONAMENTE ACTIVE', value: this.totalActiveSubscriptions(), currency: ''},
    {label: 'TOTAL LUNAR', value: this.totalMonthlyExpense(), currency: 'RON'}
  ]);
  protected readonly filter = filter;
}
