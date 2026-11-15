import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ObjectivesForm } from '../objectives-form/objectives-form';
import { FitnessObjectives } from '../../models/objective.model';

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), a[href]';

@Component({
  selector: 'app-objectives-dialog',
  imports: [ObjectivesForm],
  templateUrl: './objectives-dialog.html',
  styleUrl: './objectives-dialog.css',
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class ObjectivesDialog implements AfterViewInit, OnDestroy {
  private document = inject(DOCUMENT);

  readonly initialValues = input.required<FitnessObjectives>();
  readonly submitting = input(false);
  readonly error = input<string | null>(null);
  readonly submitted = output<FitnessObjectives>();
  readonly closed = output<void>();

  private panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private form = viewChild.required(ObjectivesForm);
  private previousFocus: HTMLElement | null = null;
  private previousOverflow = '';
  private pressedOnBackdrop = false;

  constructor() {
    this.previousFocus = this.document.activeElement as HTMLElement | null;
    this.previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
  }

  ngAfterViewInit(): void {
    const panel = this.panel().nativeElement;
    const first = panel.querySelector<HTMLElement>('[role="radio"][tabindex="0"]') ?? this.focusables()[0];
    (first ?? panel).focus();
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = this.previousOverflow;
    this.previousFocus?.focus();
  }

  onBackdropPointerDown(event: PointerEvent): void {
    this.pressedOnBackdrop = event.target === event.currentTarget;
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.pressedOnBackdrop && event.target === event.currentTarget) {
      this.requestClose();
    }
    this.pressedOnBackdrop = false;
  }

  requestClose(): void {
    if (this.submitting()) {
      return;
    }
    if (this.form().dirty() && !confirm('Ai modificări nesalvate. Sigur vrei să închizi fără să salvezi?')) {
      return;
    }
    this.closed.emit();
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.requestClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusables = this.focusables();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement as HTMLElement | null;
    const inside = active !== null && this.panel().nativeElement.contains(active);

    if (event.shiftKey && (active === first || !inside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusables(): HTMLElement[] {
    return Array.from(this.panel().nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => element.offsetParent !== null || element === this.document.activeElement,
    );
  }
}
