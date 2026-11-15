import {
  caloriesFromMacros,
  isWholeNumberInRange,
  macroCalories,
  macroShare,
  matchesPreset,
  presetMacros,
  toObjectives,
} from './objectives.utils';

describe('objectives.utils', () => {
  it('computes preset macros for 2000 kcal', () => {
    expect(presetMacros(2000)).toEqual({ protein: 150, carbohydrates: 200, fats: 67 });
  });

  it('returns zero macros for 0 kcal', () => {
    expect(presetMacros(0)).toEqual({ protein: 0, carbohydrates: 0, fats: 0 });
  });

  it('computes calories from macros', () => {
    expect(caloriesFromMacros({ protein: 150, carbohydrates: 220, fats: 65 })).toBe(2065);
  });

  it('detects whether stored macros match the preset split', () => {
    expect(matchesPreset({ calories: 2000, protein: 150, carbohydrates: 200, fats: 67 })).toBe(true);
    expect(matchesPreset({ calories: 2000, protein: 150, carbohydrates: 220, fats: 65 })).toBe(false);
  });

  it('computes the percentage split of a macro', () => {
    expect(macroShare({ protein: 150, carbohydrates: 200, fats: 67 }, 'protein')).toBe(30);
    expect(macroShare({ protein: 0, carbohydrates: 0, fats: 0 }, 'fats')).toBe(0);
  });

  it('validates whole numbers in range', () => {
    expect(isWholeNumberInRange(500, 500, 10000)).toBe(true);
    expect(isWholeNumberInRange(499, 500, 10000)).toBe(false);
    expect(isWholeNumberInRange(1500.5, 500, 10000)).toBe(false);
    expect(isWholeNumberInRange(null, 500, 10000)).toBe(false);
  });

  it('normalizes backend responses and detects the empty state', () => {
    expect(toObjectives({ calories: 2000, protein: 150, carbohydrates: 220, fats: 65 })).toEqual({
      calories: 2000,
      protein: 150,
      carbohydrates: 220,
      fats: 65,
    });
    expect(toObjectives(null)).toBeNull();
    expect(toObjectives('')).toBeNull();
    expect(toObjectives({})).toBeNull();
    expect(toObjectives({ calories: null, protein: null, carbohydrates: null, fats: null })).toBeNull();
    expect(toObjectives({ calories: 0, protein: 0, carbohydrates: 0, fats: 0 })).toBeNull();
  });

  it('computes the calories of a single macro', () => {
    const macros = { protein: 150, carbohydrates: 200, fats: 67 };
    expect(macroCalories(macros, 'protein')).toBe(600);
    expect(macroCalories(macros, 'carbohydrates')).toBe(800);
    expect(macroCalories(macros, 'fats')).toBe(603);
  });

  it('accepts the exact upper bound', () => {
    expect(isWholeNumberInRange(10000, 500, 10000)).toBe(true);
    expect(isWholeNumberInRange(10001, 500, 10000)).toBe(false);
  });

  it('fills missing fields with 0 and rounds decimals', () => {
    expect(toObjectives({ calories: 2000 })).toEqual({ calories: 2000, protein: 0, carbohydrates: 0, fats: 0 });
    expect(toObjectives({ calories: 1999.6, protein: 149.5, carbohydrates: 200.2, fats: 66.7 })).toEqual({
      calories: 2000,
      protein: 150,
      carbohydrates: 200,
      fats: 67,
    });
  });

  it('ignores non-numeric fields', () => {
    expect(toObjectives({ calories: '2000', protein: 150, carbohydrates: 200, fats: 67 })).toEqual({
      calories: 0,
      protein: 150,
      carbohydrates: 200,
      fats: 67,
    });
    expect(toObjectives({ calories: Number.NaN, protein: Number.POSITIVE_INFINITY })).toBeNull();
  });
});
