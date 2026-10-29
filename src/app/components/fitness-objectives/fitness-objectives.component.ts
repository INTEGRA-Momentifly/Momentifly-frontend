import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ObjectiveService } from '../../services/objective.service';
import {
  FitnessObjectives,
  MacroKey,
  Macros,
  ObjectiveMode,
} from '../../models/objective.model';

interface MacroDial {
  key: MacroKey;
  label: string;
  max: number;
  kcalPerGram: number;
  accent: 'primary' | 'secondary' | 'tertiary';
}

const KCAL_PER_GRAM: Record<MacroKey, number> = {
  protein: 4,
  carbohydrates: 4,
  fats: 9,
};

const PRESET_SPLIT: Record<MacroKey, number> = {
  protein: 0.3,
  carbohydrates: 0.5,
  fats: 0.2,
};

const DEFAULT_CALORIES = 2000;
const MAX_CALORIES = 10000;

@Component({
  selector: 'app-fitness-objectives',
  imports: [NgTemplateOutlet],
  templateUrl: './fitness-objectives.component.html',
  styleUrl: './fitness-objectives.component.css',
  host: {
    '(document:keydown.escape)': 'closeEdit()',
  },
})
export class FitnessObjectivesComponent implements OnInit {
  private objectiveService = inject(ObjectiveService);

  readonly dials: MacroDial[] = [
    { key: 'protein', label: 'Proteine (g)', max: 400, kcalPerGram: KCAL_PER_GRAM.protein, accent: 'primary' },
    { key: 'carbohydrates', label: 'Carbohidrați (g)', max: 700, kcalPerGram: KCAL_PER_GRAM.carbohydrates, accent: 'secondary' },
    { key: 'fats', label: 'Grăsimi (g)', max: 250, kcalPerGram: KCAL_PER_GRAM.fats, accent: 'tertiary' },
  ];

  objectives = signal<FitnessObjectives | null>(null);
  loading = signal(true);
  saving = signal(false);
  loadError = signal(false);
  saveError = signal(false);
  editOpen = signal(false);

  mode = signal<ObjectiveMode>('preset');
  caloriesInput = signal(DEFAULT_CALORIES);
  manualMacros = signal<Macros>(this.splitCalories(DEFAULT_CALORIES));

  macros = computed<Macros>(() =>
    this.mode() === 'preset' ? this.splitCalories(this.caloriesInput()) : this.manualMacros(),
  );

  calories = computed(() =>
    this.mode() === 'preset' ? this.caloriesInput() : this.caloriesFromMacros(this.manualMacros()),
  );

  canSave = computed(() => this.calories() > 0 && !this.saving());

  ngOnInit(): void {
    this.loadObjectives();
  }

  loadObjectives(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.objectiveService.getObjectives().subscribe({
      next: (objectives: FitnessObjectives | null) => {
        this.objectives.set(objectives);
        if (objectives) {
          this.fillForm(objectives);
        }
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Failed to load objectives:', error);
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  setMode(mode: ObjectiveMode): void {
    if (mode === this.mode()) {
      return;
    }

    if (mode === 'manual') {
      this.manualMacros.set(this.macros());
    } else {
      this.caloriesInput.set(this.calories());
    }

    this.mode.set(mode);
  }

  onCaloriesInput(event: Event): void {
    this.caloriesInput.set(this.readNumber(event, MAX_CALORIES));
  }

  onMacroInput(key: MacroKey, max: number, event: Event): void {
    const value = this.readNumber(event, max);
    this.manualMacros.update((macros) => ({ ...macros, [key]: value }));
  }

  fillPercent(dial: MacroDial): number {
    return Math.min(100, (this.macros()[dial.key] / dial.max) * 100);
  }

  caloriesShare(objectives: FitnessObjectives, dial: MacroDial): number {
    if (objectives.calories <= 0) {
      return 0;
    }
    return Math.round((objectives[dial.key] * dial.kcalPerGram * 100) / objectives.calories);
  }

  openEdit(): void {
    const objectives = this.objectives();
    if (objectives) {
      this.fillForm(objectives);
    }
    this.saveError.set(false);
    this.editOpen.set(true);
  }

  closeEdit(): void {
    if (this.saving()) {
      return;
    }
    this.editOpen.set(false);
  }

  save(): void {
    if (!this.canSave()) {
      return;
    }

    const payload: FitnessObjectives = {
      calories: this.calories(),
      ...this.macros(),
    };

    this.saving.set(true);
    this.saveError.set(false);

    this.objectiveService.saveObjectives(payload).subscribe({
      next: (saved: FitnessObjectives) => {
        this.objectives.set(saved ?? payload);
        this.saving.set(false);
        this.editOpen.set(false);
      },
      error: (error: unknown) => {
        console.error('Failed to save objectives:', error);
        this.saveError.set(true);
        this.saving.set(false);
      },
    });
  }

  private fillForm(objectives: FitnessObjectives): void {
    const { calories, ...macros } = objectives;
    const preset = this.splitCalories(calories);
    const matchesPreset = (Object.keys(preset) as MacroKey[]).every((key) => preset[key] === macros[key]);

    this.caloriesInput.set(calories);
    this.manualMacros.set(macros);
    this.mode.set(matchesPreset ? 'preset' : 'manual');
  }

  private splitCalories(calories: number): Macros {
    return {
      protein: Math.round((calories * PRESET_SPLIT.protein) / KCAL_PER_GRAM.protein),
      carbohydrates: Math.round((calories * PRESET_SPLIT.carbohydrates) / KCAL_PER_GRAM.carbohydrates),
      fats: Math.round((calories * PRESET_SPLIT.fats) / KCAL_PER_GRAM.fats),
    };
  }

  private caloriesFromMacros(macros: Macros): number {
    return (
      macros.protein * KCAL_PER_GRAM.protein +
      macros.carbohydrates * KCAL_PER_GRAM.carbohydrates +
      macros.fats * KCAL_PER_GRAM.fats
    );
  }

  private readNumber(event: Event, max: number): number {
    const value = Math.round(Number((event.target as HTMLInputElement).value));
    return Number.isFinite(value) ? Math.min(Math.max(value, 0), max) : 0;
  }
}
