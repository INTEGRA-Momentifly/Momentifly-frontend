import { FitnessObjectives, MacroKey, Macros } from '../models/objective.model';

export const KCAL_PER_GRAM: Readonly<Record<MacroKey, number>> = {
  protein: 4,
  carbohydrates: 4,
  fats: 9,
};

export const PRESET_SPLIT: Readonly<Record<MacroKey, number>> = {
  protein: 0.3,
  carbohydrates: 0.4,
  fats: 0.3,
};

export const CALORIE_LIMITS = { min: 500, max: 10000 } as const;

export const MACRO_LIMITS: Readonly<Record<MacroKey, { min: number; max: number }>> = {
  protein: { min: 0, max: 400 },
  carbohydrates: { min: 0, max: 800 },
  fats: { min: 0, max: 250 },
};

export const MACRO_KEYS: readonly MacroKey[] = ['protein', 'carbohydrates', 'fats'];

export const EMPTY_MACROS: Macros = { protein: 0, carbohydrates: 0, fats: 0 };

export function presetMacros(calories: number): Macros {
  return {
    protein: Math.round((calories * PRESET_SPLIT.protein) / KCAL_PER_GRAM.protein),
    carbohydrates: Math.round((calories * PRESET_SPLIT.carbohydrates) / KCAL_PER_GRAM.carbohydrates),
    fats: Math.round((calories * PRESET_SPLIT.fats) / KCAL_PER_GRAM.fats),
  };
}

export function caloriesFromMacros(macros: Macros): number {
  return MACRO_KEYS.reduce((sum, key) => sum + macros[key] * KCAL_PER_GRAM[key], 0);
}

export function matchesPreset(objectives: FitnessObjectives): boolean {
  const preset = presetMacros(objectives.calories);
  return MACRO_KEYS.every((key) => preset[key] === objectives[key]);
}

export function macroCalories(macros: Macros, key: MacroKey): number {
  return macros[key] * KCAL_PER_GRAM[key];
}

export function macroShare(macros: Macros, key: MacroKey): number {
  const total = caloriesFromMacros(macros);
  return total > 0 ? Math.round((macroCalories(macros, key) * 100) / total) : 0;
}

export function isWholeNumberInRange(value: number | null, min: number, max: number): boolean {
  return value !== null && Number.isInteger(value) && value >= min && value <= max;
}

export function toObjectives(body: unknown): FitnessObjectives | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const source = body as Record<string, unknown>;
  const fields = ['calories', ...MACRO_KEYS] as const;
  const values = fields.map((field) => {
    const value = source[field];
    return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : null;
  });

  if (values.every((value) => value === null || value === 0)) {
    return null;
  }

  const [calories, protein, carbohydrates, fats] = values.map((value) => value ?? 0);
  return { calories, protein, carbohydrates, fats };
}
