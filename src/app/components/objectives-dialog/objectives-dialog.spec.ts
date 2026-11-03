import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FitnessObjectives } from '../../models/objective.model';
import { ObjectivesForm } from '../objectives-form/objectives-form';
import { ObjectivesDialog } from './objectives-dialog';

const OBJECTIVES: FitnessObjectives = { calories: 2000, protein: 150, carbohydrates: 200, fats: 67 };

// Focus trapping (Tab / Shift+Tab) is not tested here: it relies on `offsetParent`,
// which jsdom always reports as null because it has no layout engine.
describe('ObjectivesDialog', () => {
  let fixture: ComponentFixture<ObjectivesDialog>;
  let component: ObjectivesDialog;
  let el: HTMLElement;
  let closed: ReturnType<typeof vi.fn<() => void>>;

  function create(inputs: Record<string, unknown> = {}): void {
    fixture = TestBed.createComponent(ObjectivesDialog);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.componentRef.setInput('initialValues', OBJECTIVES);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    closed = vi.fn();
    component.closed.subscribe(closed);
    fixture.detectChanges();
  }

  const form = () => fixture.debugElement.query(By.directive(ObjectivesForm)).componentInstance as ObjectivesForm;
  const backdrop = () => el.querySelector<HTMLElement>('.backdrop')!;
  const panel = () => el.querySelector<HTMLElement>('[role="dialog"]')!;

  function pressEscape(): void {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  function makeDirty(): void {
    const input = el.querySelector<HTMLInputElement>('input[id$="-calories"]')!;
    input.value = '2500';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ObjectivesDialog] }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  it('renders an accessible modal dialog with the form prefilled', () => {
    create();

    expect(panel().getAttribute('aria-modal')).toBe('true');
    expect(panel().getAttribute('aria-labelledby')).toBe('objectives-dialog-title');
    expect(form().variant()).toBe('edit');
    expect(form().initialValues()).toEqual(OBJECTIVES);
  });

  it('locks page scrolling while open and restores it on destroy', () => {
    document.body.style.overflow = 'scroll';
    create();

    expect(document.body.style.overflow).toBe('hidden');

    fixture.destroy();

    expect(document.body.style.overflow).toBe('scroll');
  });

  describe('closing without changes', () => {
    beforeEach(() => create());

    it('closes from the close button', () => {
      el.querySelector<HTMLButtonElement>('[aria-label="Închide"]')!.click();
      expect(closed).toHaveBeenCalledTimes(1);
    });

    it('closes from the cancel button', () => {
      Array.from(el.querySelectorAll('button'))
        .find((b) => b.textContent!.includes('Anulează'))!
        .click();
      expect(closed).toHaveBeenCalledTimes(1);
    });

    it('closes on Escape', () => {
      pressEscape();
      expect(closed).toHaveBeenCalledTimes(1);
    });

    it('closes on a click that starts and ends on the backdrop', () => {
      backdrop().dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      backdrop().dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(closed).toHaveBeenCalledTimes(1);
    });

    it('stays open when a click starts inside the panel and ends on the backdrop', () => {
      panel().dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      backdrop().dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(closed).not.toHaveBeenCalled();
    });

    it('stays open on clicks inside the panel', () => {
      panel().dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
      panel().dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(closed).not.toHaveBeenCalled();
    });
  });

  describe('closing with unsaved changes', () => {
    beforeEach(() => {
      create();
      makeDirty();
    });

    it('stays open when the user cancels the confirmation', () => {
      const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);

      pressEscape();

      expect(confirm).toHaveBeenCalledOnce();
      expect(closed).not.toHaveBeenCalled();
    });

    it('closes when the user confirms', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      pressEscape();

      expect(closed).toHaveBeenCalledTimes(1);
    });
  });

  it('cannot be closed while saving', () => {
    create({ submitting: true });

    pressEscape();
    el.querySelector<HTMLButtonElement>('[aria-label="Închide"]')!.click();

    expect(closed).not.toHaveBeenCalled();
  });

  it('forwards the submitted values from the form', () => {
    create();
    const submitted = vi.fn();
    component.submitted.subscribe(submitted);

    form().submitted.emit(OBJECTIVES);

    expect(submitted).toHaveBeenCalledWith(OBJECTIVES);
  });

  it('shows the save error passed in', () => {
    create({ error: 'Nu am putut salva obiectivele. Încearcă din nou.' });

    expect(el.querySelector('[role="alert"]')!.textContent).toContain('Nu am putut salva obiectivele.');
  });
});
