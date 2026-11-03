import { Component, computed, input, output } from '@angular/core';
import { formatNumber } from '../../utils/format';

const RING_SIZE = 235;
const RING_STROKE = 6;

@Component({
  selector: 'app-calorie-goal-card',
  templateUrl: './calorie-goal-card.html',
  styleUrl: './calorie-goal-card.css',
})
export class CalorieGoalCard {
  readonly goal = input.required<number>();
  readonly consumed = input.required<number>();
  readonly edit = output<void>();

  readonly size = RING_SIZE;
  readonly stroke = RING_STROKE;
  readonly radius = (RING_SIZE - RING_STROKE) / 2;
  readonly circumference = 2 * Math.PI * this.radius;
  readonly format = formatNumber;

  readonly remaining = computed(() => this.goal() - this.consumed());
  readonly over = computed(() => this.remaining() < 0);

  readonly progress = computed(() => {
    const goal = this.goal();
    return goal > 0 ? Math.min(this.consumed() / goal, 1) : 0;
  });

  readonly dashOffset = computed(() => this.circumference * (1 - this.progress()));

  readonly ringLabel = computed(() =>
    this.over()
      ? `Ai depășit obiectivul cu ${formatNumber(-this.remaining())} kcal: ${formatNumber(this.consumed())} din ${formatNumber(this.goal())} kcal consumate`
      : `${formatNumber(this.consumed())} din ${formatNumber(this.goal())} kcal consumate, ${formatNumber(this.remaining())} kcal rămase`,
  );
}
