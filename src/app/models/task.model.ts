export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Task {
  id: string;
  userId: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  difficulty: Difficulty;
  completed: boolean;
}
