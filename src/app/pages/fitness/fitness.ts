import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CalorieGoalCard } from '../../components/calorie-goal-card/calorie-goal-card';
import { MacrosCard } from '../../components/macros-card/macros-card';
import { ObjectivesForm } from '../../components/objectives-form/objectives-form';
import { ObjectivesDialog } from '../../components/objectives-dialog/objectives-dialog';
import { FitnessObjectives, Macros } from '../../models/objective.model';
import { ObjectiveService } from '../../services/objective.service';
import { EMPTY_MACROS } from '../../utils/objectives.utils';
import { formatLongDate } from '../../utils/format';

type PageStatus = 'loading' | 'empty' | 'ready' | 'error';

const SAVE_ERROR = 'Nu am putut salva obiectivele. Încearcă din nou.';

@Component({
  selector: 'app-fitness',
  imports: [CalorieGoalCard, MacrosCard, ObjectivesForm, ObjectivesDialog],
  templateUrl: './fitness.html',
  styleUrl: './fitness.css',
})
export class Fitness implements OnInit {
  private objectiveService = inject(ObjectiveService);

  // Intake comes from the food tracker task; until it is wired in, nothing is consumed.
  readonly consumedCalories = 0;
  readonly consumedMacros: Macros = EMPTY_MACROS;

  readonly today = formatLongDate(new Date());
  readonly status = signal<PageStatus>('loading');
  readonly objectives = signal<FitnessObjectives | null>(null);
  readonly editOpen = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadObjectives();
  }

  loadObjectives(): void {
    this.status.set('loading');

    this.objectiveService.get().subscribe({
      next: (objectives: FitnessObjectives | null) => this.applyObjectives(objectives),
      error: (error: unknown) => {
        console.error('Failed to load objectives:', error);
        this.status.set('error');
      },
    });
  }

  openEdit(): void {
    this.submitError.set(null);
    this.editOpen.set(true);
  }

  closeEdit(): void {
    this.editOpen.set(false);
    this.submitError.set(null);
  }

  create(values: FitnessObjectives): void {
    this.save(this.objectiveService.create(values), values);
  }

  update(values: FitnessObjectives): void {
    this.save(this.objectiveService.update(values), values);
  }

  private save(request: Observable<FitnessObjectives | null>, values: FitnessObjectives): void {
    this.submitting.set(true);
    this.submitError.set(null);

    request.subscribe({
      next: (saved: FitnessObjectives | null) => {
        this.submitting.set(false);
        this.editOpen.set(false);
        if (saved) {
          this.applyObjectives(saved);
        } else {
          this.objectives.set(values);
          this.loadObjectives();
        }
      },
      error: (error: unknown) => {
        console.error('Failed to save objectives:', error);
        this.submitting.set(false);
        this.submitError.set(SAVE_ERROR);
      },
    });
  }

  private applyObjectives(objectives: FitnessObjectives | null): void {
    this.objectives.set(objectives);
    this.status.set(objectives ? 'ready' : 'empty');
  }
}
