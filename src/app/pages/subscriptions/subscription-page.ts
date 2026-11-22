import {Component, OnInit, inject, signal} from '@angular/core';
import {SubscriptionList} from '../../components/subscription-list/subscripton-list';
import {ButtonDirective} from 'primeng/button';
import {SubscriptionService} from '../../services/subscription.service';
import {Subscription, SubscriptionFilter} from '../../models/subscription.model';
import {Reminders} from '../reminders/reminder';
import {CreateSubscriptionComponent} from '../../components/create-subscription/create-subscription';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-subscriptions',
  imports: [ButtonDirective, SubscriptionList, Reminders, CreateSubscriptionComponent],
  styleUrl: './subscription-page.css',
  templateUrl: 'subscription-page.html',
})
export class Subscriptions implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private authService = inject(AuthService);

  showCreateSubscriptionPopup = false;

  subscriptions = signal<Subscription[]>([]);
  currentUserId = signal<string | null>(null);
  selectedFilter = signal<SubscriptionFilter>('ALL');


  ngOnInit() {
    this.loadCurrentUser();
    this.loadSubscriptions();
  }

  loadCurrentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId.set(user?.id ?? null);
      },
      error: (err) => console.error('Eroare la preluarea userului curent: ' + err)
    })
  }

  onFilterChange(filter: SubscriptionFilter) {
    this.selectedFilter.set(filter);
    this.loadSubscriptions(filter)
  }

  loadSubscriptions(filter: SubscriptionFilter = this.selectedFilter()) {
    const request$ =
      filter === "ACTIVE"
        ? this.subscriptionService.getActiveSubscriptions()
        : filter === "EXPIRED"
          ? this.subscriptionService.getExpiredSubscriptions()
          : this.subscriptionService.getAllSubscriptions();
    request$.subscribe({
      next: (data) => this.subscriptions.set(data),
      error: (err) => console.error('Eroare: ', err)
    });
  }

  onToggleAutoRenewal(sub: Subscription) {
    if (!sub.id) return;

    this.subscriptionService.updateAutoRenewal(sub.id, !sub.autoRenewal).subscribe({
      next: (updated) => {
        this.subscriptions.update((list) =>
          list.map((item) => (item.id === updated.id ? updated : item))
        )
      },
      error: (err) => console.error('Eroare la actualizarea autoRenewal', err)
    });
  }

  onSubscriptionCreated(): void {
    this.showCreateSubscriptionPopup = false;
    console.log('Abonamentul a fost creat cu succes!');

    this.loadSubscriptions(this.selectedFilter());
  }
}
