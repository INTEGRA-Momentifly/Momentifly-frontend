export type FoodCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER'

export interface FoodLog{
  id: string,
  userId: string,
  description: string,
  foodCategory: FoodCategory,
  proteins?: number | null,
  carbs?: number | null,
  fats?: number | null,
  calories?: number | null,
  date: string
}
