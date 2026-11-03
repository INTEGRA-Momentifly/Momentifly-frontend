import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { MacroDial } from '../macro-dial/macro-dial';
import { FitnessObjectives, MacroKey, Macros, ObjectiveMode } from '../../models/objective.model';
import {
  CALORIE_LIMITS,
  EMPTY_MACROS,
  MACRO_KEYS,
  MACRO_LIMITS,
  caloriesFromMacros,
  isWholeNumberInRange,
  macroCalories,
  macroShare,
  matchesPreset,
  presetMacros,
} from '../../utils/objectives.utils';
import { formatNumber } from '../../utils/format';

export type ObjectivesFormVariant = 'create' | 'edit';

interface MacroField {
  key: MacroKey;
  label: string;
  accent: 'terracotta' | 'gold' | 'sage';
  min: number;
  max: number;
}

let nextFormId = 0;

@Component({
  selector: 'app-objectives-form',
  imports: [MacroDial],
  templateUrl: './objectives-form.html',
  styleUrl: './objectives-form.css',
})
export class ObjectivesForm implements OnInit {
  readonly initialValues = input<FitnessObjectives | null>(null);
  readonly variant = input<ObjectivesFormVariant>('create');
  readonly submitting = input(false);
  readonly error = input<string | null>(null);
  readonly submitted = output<FitnessObjectives>();
  readonly cancelled = output<void>();

  readonly formId = `objectives-form-${nextFormId++}`;
  readonly modes: { value: ObjectiveMode; label: string }[] = [
    { value: 'preset', label: 'Preset' },
    { value: 'manual', label: 'Manual' },
  ];
  readonly fields: MacroField[] = [
    { key: 'protein', label: 'Proteine', accent: 'terracotta', ...MACRO_LIMITS.protein },
    { key: 'carbohydrates', label: 'Carbohidrați', accent: 'gold', ...MACRO_LIMITS.carbohydrates },
    { key: 'fats', label: 'Grăsimi', accent: 'sage', ...MACRO_LIMITS.fats },
  ];

  readonly mode = signal<ObjectiveMode>('preset');
  readonly caloriesText = signal('');
  readonly manualMacros = signal<Macros>(EMPTY_MACROS);
  readonly caloriesTouched = signal(false);

  private initialSnapshot = signal('');

  readonly typedCalories = computed(() => {
    const text = this.caloriesText().trim();
    return text === '' ? null : Number(text);
  });

  readonly calories = computed(() =>
    this.mode() === 'preset' ? this.typedCalories() : caloriesFromMacros(this.manualMacros()),
  );

  readonly macros = computed<Macros>(() => {
    if (this.mode() === 'manual') {
      return this.manualMacros();
    }
    const typed = this.typedCalories();
    return typed !== null && Number.isFinite(typed) && typed > 0 ? presetMacros(typed) : EMPTY_MACROS;
  });

  readonly caloriesDisplay = computed(() =>
    this.mode() === 'preset' ? this.caloriesText() : String(this.calories() ?? 0),
  );

  readonly caloriesError = computed(() => {
    const calories = this.calories();
    if (this.mode() === 'preset' && calories === null) {
      return 'Introdu numărul de calorii.';
    }
    if (!isWholeNumberInRange(calories, CALORIE_LIMITS.min, CALORIE_LIMITS.max)) {
      return this.mode() === 'preset'
        ? `Introdu un număr între ${formatNumber(CALORIE_LIMITS.min)} și ${formatNumber(CALORIE_LIMITS.max)}.`
        : `Totalul calculat trebuie să fie între ${formatNumber(CALORIE_LIMITS.min)} și ${formatNumber(CALORIE_LIMITS.max)} kcal.`;
    }
    return null;
  });

  readonly showCaloriesError = computed(
    () => this.caloriesError() !== null && (this.caloriesTouched() || this.mode() === 'manual'),
  );

  readonly macroErrors = computed<Record<MacroKey, string | null>>(() => {
    const macros = this.macros();
    const errors = {} as Record<MacroKey, string | null>;
    for (const field of this.fields) {
      const valid = isWholeNumberInRange(macros[field.key], field.min, field.max);
      errors[field.key] = valid
        ? null
        : this.mode() === 'preset'
          ? `Valoarea calculată depășește ${field.max} g. Micșorează caloriile.`
          : `Introdu un număr întreg între ${field.min} și ${field.max}.`;
    }
    return errors;
  });

  readonly valid = computed(
    () => this.caloriesError() === null && MACRO_KEYS.every((key) => this.macroErrors()[key] === null),
  );

  readonly dirty = computed(() => this.snapshot() !== this.initialSnapshot());

  readonly summary = computed(() => {
    const macros = this.macros();
    return this.fields.map((field) => ({
      key: field.key,
      label: field.label,
      accent: field.accent,
      kcal: formatNumber(macroCalories(macros, field.key)),
      share: macroShare(macros, field.key),
    }));
  });

  ngOnInit(): void {
    const initial = this.initialValues();
    if (initial) {
      this.caloriesText.set(String(initial.calories));
      this.manualMacros.set({
        protein: initial.protein,
        carbohydrates: initial.carbohydrates,
        fats: initial.fats,
      });
      this.mode.set(matchesPreset(initial) ? 'preset' : 'manual');
    }
    this.initialSnapshot.set(this.snapshot());
  }

  setMode(mode: ObjectiveMode): void {
    if (mode === this.mode()) {
      return;
    }
    if (mode === 'manual') {
      this.manualMacros.set(this.macros());
    } else {
      this.caloriesText.set(String(this.calories() ?? ''));
    }
    this.mode.set(mode);
  }

  onModeKeydown(event: KeyboardEvent): void {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(event.key)) {
      return;
    }
    event.preventDefault();
    const next = this.mode() === 'preset' ? 'manual' : 'preset';
    this.setMode(next);
    const group = (event.currentTarget as HTMLElement).closest('[role="radiogroup"]');
    group?.querySelector<HTMLElement>(`[data-mode="${next}"]`)?.focus();
  }

  onCaloriesInput(event: Event): void {
    if (this.mode() === 'preset') {
      this.caloriesText.set((event.target as HTMLInputElement).value);
    }
  }

  onMacroInput(key: MacroKey, event: Event): void {
    const text = (event.target as HTMLInputElement).value.trim();
    this.setMacro(key, text === '' ? 0 : Number(text));
  }

  setMacro(key: MacroKey, value: number): void {
    if (this.mode() === 'manual') {
      this.manualMacros.update((macros) => ({ ...macros, [key]: value }));
    }
  }

  errorId(key: string): string {
    return `${this.formId}-${key}-error`;
  }

  submit(): void {
    this.caloriesTouched.set(true);
    const calories = this.calories();
    if (!this.valid() || this.submitting() || calories === null) {
      return;
    }
    this.submitted.emit({ calories, ...this.macros() });
  }

  private snapshot(): string {
    return JSON.stringify({ calories: this.calories(), macros: this.macros() });
  }
}
