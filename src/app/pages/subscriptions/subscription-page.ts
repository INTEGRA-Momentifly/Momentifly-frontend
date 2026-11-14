import { Component, OnInit, inject, signal } from '@angular/core';
import { SubscriptionList } from '../../components/subscription-list/subscripton-list';
import { ButtonDirective } from 'primeng/button';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../models/subscription.model';
import { Reminders } from '../reminders/reminder';
import { CreateSubscriptionComponent } from '../../components/create-subscription/create-subscription';

@Component({
  selector: 'app-subscriptions',
  imports: [ButtonDirective, SubscriptionList, Reminders, CreateSubscriptionComponent],
  styleUrl: './subscription-page.css',
  templateUrl: 'subscription-page.html',
})
export class Subscriptions implements OnInit {
  private subscriptionService = inject(SubscriptionService);

  showCreateSubscriptionPopup = false;

  subscriptions = signal<Subscription[]>([]);

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.subscriptionService.getSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions.set(data);
      },
      error: (err) => console.error('Eroare la aducerea abonamentelor:', err)
    });
  }

  onSubscriptionCreated(): void {
    this.showCreateSubscriptionPopup = false;
    console.log('Abonamentul a fost creat cu succes!');

    this.loadSubscriptions();
  }
}
