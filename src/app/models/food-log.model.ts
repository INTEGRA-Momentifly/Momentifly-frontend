export type FoodCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER'

export interface FoodLog{
  id: string,
  userId: string,
  description: string,
  foodCategory: FoodCategory,
  proteins?: number,
  carbs?: number,
  fats?: number,
  calories?: number,
  date: string
}
