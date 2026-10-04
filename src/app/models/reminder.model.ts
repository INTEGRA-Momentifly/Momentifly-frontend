export type RecurrenceEnum = 'NONE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Reminder {
  id: string;
  userId: string;
  description: string;
  reminderDate: string;
  recurrence: RecurrenceEnum;
  done: boolean;
}
