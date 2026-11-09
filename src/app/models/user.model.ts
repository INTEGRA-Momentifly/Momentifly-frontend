export interface User {
  username: string;
  email: string;
  dailyCalorieGoal: number;
  score: number;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  dailyCalorieGoal: number;
}
