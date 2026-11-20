export interface Subscription {
  id?: string;
  userId?: string;
  cost: number;
  name: string;
  endDate?: string | Date;
}
