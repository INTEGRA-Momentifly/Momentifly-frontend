export interface FitnessObjectives {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export type ObjectiveMode = 'preset' | 'manual';

export type MacroKey = 'protein' | 'carbohydrates' | 'fats';

export type Macros = Pick<FitnessObjectives, MacroKey>;
