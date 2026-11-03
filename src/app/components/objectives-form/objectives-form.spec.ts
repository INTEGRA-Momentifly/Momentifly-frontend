import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FitnessObjectives } from '../../models/objective.model';
import { presetMacros } from '../../utils/objectives.utils';
import { ObjectivesForm } from './objectives-form';

const PRESET_OBJECTIVES: FitnessObjectives = { calories: 2000, protein: 150, carbohydrates: 200, fats: 67 };
const MANUAL_OBJECTIVES: FitnessObjectives = { calories: 2065, protein: 150, carbohydrates: 220, fats: 65 };

describe('ObjectivesForm', () => {
  let fixture: ComponentFixture<ObjectivesForm>;
  let component: ObjectivesForm;
  let el: HTMLElement;

  function create(inputs: Record<string, unknown> = {}): void {
    fixture = TestBed.createComponent(ObjectivesForm);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
  }

  const caloriesInput = () => el.querySelector<HTMLInputElement>('input[id$="-calories"]')!;
  const macroInput = (label: string) => el.querySelector<HTMLInputElement>(`input[aria-label="${label} în grame"]`)!;
  const radio = (mode: 'preset' | 'manual') => el.querySelector<HTMLButtonElement>(`[role="radio"][data-mode="${mode}"]`)!;
  const submitButton = () => el.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const errors = () => Array.from(el.querySelectorAll('.field-error')).map((e) => e.textContent!.trim());

  function type(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submitForm(): void {
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();
  }

  function switchTo(mode: 'preset' | 'manual'): void {
    radio(mode).click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ObjectivesForm] }).compileComponents();
  });

  describe('preset mode', () => {
    beforeEach(() => create());

    it('is the default mode', () => {
      expect(component.mode()).toBe('preset');
      expect(radio('preset').getAttribute('aria-checked')).toBe('true');
      expect(macroInput('Proteine').readOnly).toBe(true);
    });

    it('derives macros from the typed calories using the 30/40/30 split', () => {
      type(caloriesInput(), '2000');

      expect(component.macros()).toEqual(presetMacros(2000));
      expect(macroInput('Proteine').value).toBe('150');
      expect(macroInput('Carbohidrați').value).toBe('200');
      expect(macroInput('Grăsimi').value).toBe('67');
      const summary = el.querySelector('.split-summary')!.textContent!;
      expect(summary).toContain('30%');
      expect(summary).toContain('40%');
    });

    it('does not show the required error until the field is touched', () => {
      expect(errors()).toEqual([]);

      caloriesInput().dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(errors()).toContain('Introdu numărul de calorii.');
      expect(caloriesInput().getAttribute('aria-invalid')).toBe('true');
    });

    it.each(['499', '10001', '1500.5'])('rejects %s kcal', (value) => {
      type(caloriesInput(), value);
      caloriesInput().dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(component.valid()).toBe(false);
      expect(submitButton().disabled).toBe(true);
      expect(errors().some((e) => e.startsWith('Introdu un număr între'))).toBe(true);
    });

    it.each(['500', '10000'])('accepts the boundary value %s kcal for calories', (value) => {
      type(caloriesInput(), value);

      expect(component.caloriesError()).toBeNull();
    });

    it('flags derived macros that exceed their limits', () => {
      type(caloriesInput(), '10000');

      expect(component.macroErrors().protein).toBe('Valoarea calculată depășește 400 g. Micșorează caloriile.');
      expect(component.valid()).toBe(false);
      expect(submitButton().disabled).toBe(true);
    });

    it('ignores macro edits while in preset mode', () => {
      type(caloriesInput(), '2000');
      type(macroInput('Proteine'), '300');

      expect(component.macros().protein).toBe(150);
    });
  });

  describe('manual mode', () => {
    beforeEach(() => create());

    it('copies the current macros and locks the calories field', () => {
      type(caloriesInput(), '2000');
      switchTo('manual');

      expect(component.mode()).toBe('manual');
      expect(component.manualMacros()).toEqual(presetMacros(2000));
      expect(caloriesInput().readOnly).toBe(true);
    });

    it('calculates calories from the macros (4P + 4C + 9G)', () => {
      switchTo('manual');
      type(macroInput('Proteine'), '150');
      type(macroInput('Carbohidrați'), '220');
      type(macroInput('Grăsimi'), '65');

      expect(component.calories()).toBe(2065);
      expect(caloriesInput().value).toBe('2065');
      expect(component.valid()).toBe(true);
    });

    it('shows the calculated-total error immediately when the total is too low', () => {
      switchTo('manual');

      expect(errors().some((e) => e.startsWith('Totalul calculat trebuie să fie între'))).toBe(true);
    });

    it('rejects a macro outside its range', () => {
      switchTo('manual');
      type(macroInput('Proteine'), '401');

      expect(component.macroErrors().protein).toBe('Introdu un număr întreg între 0 și 400.');
      expect(macroInput('Proteine').getAttribute('aria-invalid')).toBe('true');
    });

    it('treats an emptied macro field as 0', () => {
      switchTo('manual');
      type(macroInput('Proteine'), '150');
      type(macroInput('Proteine'), '');

      expect(component.manualMacros().protein).toBe(0);
    });

    it('carries the calculated calories back when switching to preset', () => {
      switchTo('manual');
      type(macroInput('Proteine'), '150');
      type(macroInput('Carbohidrați'), '220');
      type(macroInput('Grăsimi'), '65');
      switchTo('preset');

      expect(component.caloriesText()).toBe('2065');
      expect(component.macros()).toEqual(presetMacros(2065));
    });
  });

  it('switches mode with the arrow keys on the radiogroup', () => {
    create();
    radio('preset').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(component.mode()).toBe('manual');
    expect(radio('manual').getAttribute('aria-checked')).toBe('true');
  });

  describe('submit', () => {
    it('emits the objectives when the form is valid', () => {
      create();
      const submitted = vi.fn();
      component.submitted.subscribe(submitted);

      type(caloriesInput(), '2000');
      submitForm();

      expect(submitted).toHaveBeenCalledWith(PRESET_OBJECTIVES);
    });

    it('does not emit when the form is invalid and marks calories as touched', () => {
      create();
      const submitted = vi.fn();
      component.submitted.subscribe(submitted);

      submitForm();

      expect(submitted).not.toHaveBeenCalled();
      expect(errors()).toContain('Introdu numărul de calorii.');
    });

    it('does not emit while a save is in progress', () => {
      create({ initialValues: PRESET_OBJECTIVES, submitting: true });
      const submitted = vi.fn();
      component.submitted.subscribe(submitted);

      submitForm();

      expect(submitted).not.toHaveBeenCalled();
    });
  });

  describe('initial values', () => {
    it('opens in preset mode when the values match the preset split', () => {
      create({ initialValues: PRESET_OBJECTIVES });

      expect(component.mode()).toBe('preset');
      expect(caloriesInput().value).toBe('2000');
    });

    it('opens in manual mode with the stored macros otherwise', () => {
      create({ initialValues: MANUAL_OBJECTIVES });

      expect(component.mode()).toBe('manual');
      expect(macroInput('Carbohidrați').value).toBe('220');
      expect(component.calories()).toBe(2065);
    });

    it('is not dirty until something changes', () => {
      create({ initialValues: PRESET_OBJECTIVES });
      expect(component.dirty()).toBe(false);

      type(caloriesInput(), '2100');

      expect(component.dirty()).toBe(true);
    });
  });

  describe('variants and states', () => {
    it('create variant has no cancel button and the long save label', () => {
      create({ variant: 'create' });

      expect(el.textContent).not.toContain('Anulează');
      expect(submitButton().textContent!.trim()).toBe('Salvează obiectivele');
    });

    it('edit variant shows a cancel button that emits cancelled', () => {
      create({ variant: 'edit', initialValues: PRESET_OBJECTIVES });
      const cancelled = vi.fn();
      component.cancelled.subscribe(cancelled);

      expect(submitButton().textContent!.trim()).toBe('Salvează');
      const cancel = Array.from(el.querySelectorAll('button')).find((b) => b.textContent!.includes('Anulează'))!;
      cancel.click();

      expect(cancelled).toHaveBeenCalled();
    });

    it('disables the form and shows progress while submitting', () => {
      create({ initialValues: PRESET_OBJECTIVES, submitting: true });

      expect(el.querySelector('fieldset')!.disabled).toBe(true);
      expect(submitButton().disabled).toBe(true);
      expect(submitButton().getAttribute('aria-busy')).toBe('true');
      expect(submitButton().textContent).toContain('Se salvează…');
    });

    it('shows the error message as an alert', () => {
      create({ error: 'Nu am putut salva obiectivele. Încearcă din nou.' });

      expect(el.querySelector('[role="alert"]')!.textContent).toContain('Nu am putut salva obiectivele.');
    });
  });
});
