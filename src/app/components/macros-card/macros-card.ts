import { Component, computed, input } from '@angular/core';
import { FitnessObjectives, MacroKey, Macros } from '../../models/objective.model';
import { formatNumber } from '../../utils/format';

interface MacroRow {
  key: MacroKey;
  label: string;
  accent: 'terracotta' | 'gold' | 'sage';
}

const ROWS: MacroRow[] = [
  { key: 'protein', label: 'Proteine', accent: 'terracotta' },
  { key: 'carbohydrates', label: 'Carbohidrați', accent: 'gold' },
  { key: 'fats', label: 'Grăsimi', accent: 'sage' },
];

@Component({
  selector: 'app-macros-card',
  templateUrl: './macros-card.html',
  styleUrl: './macros-card.css',
})
export class MacrosCard {
  readonly objectives = input.required<FitnessObjectives>();
  readonly consumed = input.required<Macros>();
  readonly consumedCalories = input.required<number>();

  readonly rows = computed(() =>
    ROWS.map((row) => {
      const value = this.consumed()[row.key];
      const target = this.objectives()[row.key];
      return {
        ...row,
        value,
        target,
        percent: target > 0 ? Math.min((value / target) * 100, 100) : 0,
      };
    }),
  );

  readonly stats = computed(() => [
    { label: 'Total kcal', value: formatNumber(this.consumedCalories()), unit: 'kcal' },
    { label: 'Proteine', value: formatNumber(this.consumed().protein), unit: 'g' },
    { label: 'Carbs', value: formatNumber(this.consumed().carbohydrates), unit: 'g' },
    { label: 'Grăsimi', value: formatNumber(this.consumed().fats), unit: 'g' },
  ]);
}
