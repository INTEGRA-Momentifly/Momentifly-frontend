export type SubscriptionFilter = 'ALL' | 'ACTIVE' | 'EXPIRED';

export interface Subscription {
  id?: string;
  userId?: string;
  cost: number;
  name: string;
  autoRenewal: boolean;
  endDate?: string | Date;
}
