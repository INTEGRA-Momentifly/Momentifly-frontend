import {Subscription} from './models/subscription.model';
import {signal} from '@angular/core';


export const mockSubscriptions = signal<Subscription[]>([
  { name: 'Adobe CC', cost: 239.99, endDate: new Date('2026-10-13') },
  { name: 'Netflix', cost: 45.99, endDate: new Date('2026-10-15') },
  { name: 'YouTube Premium', cost: 35.99, endDate: new Date('2026-10-18') },
  { name: 'Spotify', cost: 24.99, endDate: new Date('2026-10-25') },
  { name: 'Notion', cost: 16.00, endDate: new Date('2026-11-01') },
  { name: 'iCloud 200GB', cost: 5.99, endDate: new Date('2026-11-10') }
]);
