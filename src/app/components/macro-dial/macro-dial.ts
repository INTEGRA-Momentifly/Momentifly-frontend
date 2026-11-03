import { Component, computed, input, output, signal } from '@angular/core';

type DialAccent = 'terracotta' | 'gold' | 'sage';

const SIZE = 120;
const CENTER = SIZE / 2;
const RADIUS = 48;
const START_ANGLE = -135;
const SWEEP = 270;

@Component({
  selector: 'app-macro-dial',
  templateUrl: './macro-dial.html',
  styleUrl: './macro-dial.css',
})
export class MacroDial {
  readonly value = input.required<number>();
  readonly min = input(0);
  readonly max = input.required<number>();
  readonly accent = input.required<DialAccent>();
  readonly labelId = input.required<string>();
  readonly describedBy = input<string | null>(null);
  readonly readonly = input(false);
  readonly disabled = input(false);
  readonly valueChange = output<number>();

  readonly dragging = signal(false);
  readonly trackPath = this.arc(START_ANGLE, START_ANGLE + SWEEP);

  readonly clampedValue = computed(() => Math.min(Math.max(this.value(), this.min()), this.max()));

  readonly angle = computed(() => {
    const range = this.max() - this.min();
    const ratio = range > 0 ? (this.clampedValue() - this.min()) / range : 0;
    return START_ANGLE + ratio * SWEEP;
  });

  readonly valuePath = computed(() =>
    this.angle() > START_ANGLE + 0.5 ? this.arc(START_ANGLE, this.angle()) : null,
  );

  readonly knob = computed(() => this.point(this.angle()));

  readonly interactive = computed(() => !this.readonly() && !this.disabled());

  onPointerDown(event: PointerEvent): void {
    if (!this.interactive()) {
      return;
    }
    const target = event.currentTarget as HTMLElement;
    target.setPointerCapture(event.pointerId);
    target.focus();
    this.dragging.set(true);
    this.updateFromPointer(event, target);
    event.preventDefault();
  }

  onPointerMove(event: PointerEvent): void {
    if (this.dragging()) {
      this.updateFromPointer(event, event.currentTarget as HTMLElement);
    }
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    this.dragging.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.interactive()) {
      return;
    }

    const step = event.shiftKey ? 10 : 1;
    const current = this.clampedValue();
    const next: Record<string, number> = {
      ArrowUp: current + step,
      ArrowRight: current + step,
      ArrowDown: current - step,
      ArrowLeft: current - step,
      PageUp: current + 10,
      PageDown: current - 10,
      Home: this.min(),
      End: this.max(),
    };

    if (event.key in next) {
      event.preventDefault();
      this.emit(next[event.key]);
    }
  }

  private updateFromPointer(event: PointerEvent, target: HTMLElement): void {
    const rect = target.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const end = START_ANGLE + SWEEP;

    if (angle < START_ANGLE || angle > end) {
      angle = this.clampedValue() > (this.min() + this.max()) / 2 ? end : START_ANGLE;
    }

    const ratio = (angle - START_ANGLE) / SWEEP;
    this.emit(this.min() + ratio * (this.max() - this.min()));
  }

  private emit(value: number): void {
    const next = Math.min(Math.max(Math.round(value), this.min()), this.max());
    if (next !== this.value()) {
      this.valueChange.emit(next);
    }
  }

  private point(angle: number): { x: number; y: number } {
    const radians = (angle * Math.PI) / 180;
    return { x: CENTER + RADIUS * Math.sin(radians), y: CENTER - RADIUS * Math.cos(radians) };
  }

  private arc(from: number, to: number): string {
    const start = this.point(from);
    const end = this.point(to);
    const largeArc = to - from > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }
}
