import {Component, inject, signal} from '@angular/core';
import {SubscriptionList} from '../../components/subscription-list/subscripton-list';
import {ButtonDirective} from 'primeng/button';
import {SubscriptionService} from '../../services/subscription.service';
import {Subscription} from '../../models/subscription.model';

@Component({
  selector:'app-subscriptions',
  imports: [ButtonDirective, SubscriptionList],
  styleUrl:'./subscription-page.css',
  templateUrl:'subscription-page.html'
})

export class Subscriptions{
  private subscriptionService = inject(SubscriptionService);
  subscriptions = signal<Subscription[]>([]);

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions(){
    this.subscriptionService.getSubscriptions().subscribe({
      next: (data) => this.subscriptions.set(data),
      error: (err) => console.error('Erroare: ', err)
    });
  }
}


