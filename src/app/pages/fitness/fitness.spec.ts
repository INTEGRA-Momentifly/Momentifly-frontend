import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, Subject, of, throwError } from 'rxjs';
import { ObjectivesForm } from '../../components/objectives-form/objectives-form';
import { FitnessObjectives } from '../../models/objective.model';
import { ObjectiveService } from '../../services/objective.service';
import { formatNumber } from '../../utils/format';
import { Fitness } from './fitness';

const OBJECTIVES: FitnessObjectives = { calories: 2000, protein: 150, carbohydrates: 200, fats: 67 };
const UPDATED: FitnessObjectives = { calories: 2400, protein: 180, carbohydrates: 240, fats: 80 };
const SAVE_ERROR = 'Nu am putut salva obiectivele. Încearcă din nou.';

type ApiStub = {
  get: ReturnType<typeof vi.fn<() => Observable<FitnessObjectives | null>>>;
  create: ReturnType<typeof vi.fn<(o: FitnessObjectives) => Observable<FitnessObjectives | null>>>;
  update: ReturnType<typeof vi.fn<(o: FitnessObjectives) => Observable<FitnessObjectives | null>>>;
};

describe('Fitness page', () => {
  let fixture: ComponentFixture<Fitness>;
  let component: Fitness;
  let el: HTMLElement;
  let api: ApiStub;

  beforeEach(async () => {
    api = { get: vi.fn(), create: vi.fn(), update: vi.fn() };
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [Fitness],
      providers: [{ provide: ObjectiveService, useValue: api }],
    }).compileComponents();
  });

  afterEach(() => vi.restoreAllMocks());

  function render(): void {
    fixture = TestBed.createComponent(Fitness);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  }

  function refresh(): void {
    fixture.detectChanges();
  }

  const form = () => fixture.debugElement.query(By.directive(ObjectivesForm))?.componentInstance as ObjectivesForm;
  const dialog = () => el.querySelector('[role="dialog"]');
  const button = (text: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.includes(text))!;

  it('shows a loading skeleton while the objectives are loading', () => {
    api.get.mockReturnValue(new Subject<FitnessObjectives | null>());
    render();

    expect(component.status()).toBe('loading');
    expect(el.querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it('shows the setup form when the user has no objectives', () => {
    api.get.mockReturnValue(of(null));
    render();

    expect(component.status()).toBe('empty');
    expect(el.textContent).toContain('Setează-ți obiectivele');
    expect(form()).toBeTruthy();
  });

  it('shows the goal cards when objectives exist', () => {
    api.get.mockReturnValue(of(OBJECTIVES));
    render();

    expect(component.status()).toBe('ready');
    expect(el.textContent).toContain('Obiectiv caloric zilnic');
    expect(el.textContent).toContain('Macronutrienți');
    expect(el.textContent).toContain(`din ${formatNumber(2000)} kcal`);
    expect(el.textContent).toContain('0 / 150g');
  });

  it('does not render the food journal (it belongs to the food tracker task)', () => {
    api.get.mockReturnValue(of(OBJECTIVES));
    render();

    expect(el.textContent).not.toContain('Jurnal de azi');
    expect(el.querySelector('app-food-journal')).toBeNull();
  });

  it('shows an error card and retries loading', () => {
    api.get.mockReturnValueOnce(throwError(() => new Error('offline'))).mockReturnValueOnce(of(OBJECTIVES));
    render();

    expect(component.status()).toBe('error');
    expect(el.querySelector('[role="alert"]')!.textContent).toContain('Nu am putut încărca obiectivele.');

    button('Reîncearcă').click();
    refresh();

    expect(api.get).toHaveBeenCalledTimes(2);
    expect(component.status()).toBe('ready');
  });

  describe('creating objectives', () => {
    beforeEach(() => {
      api.get.mockReturnValue(of(null));
      render();
    });

    it('saves the submitted values and shows the goal cards', () => {
      const pending = new Subject<FitnessObjectives | null>();
      api.create.mockReturnValue(pending);

      form().submitted.emit(OBJECTIVES);
      refresh();

      expect(api.create).toHaveBeenCalledWith(OBJECTIVES);
      expect(component.submitting()).toBe(true);

      pending.next(OBJECTIVES);
      pending.complete();
      refresh();

      expect(component.submitting()).toBe(false);
      expect(component.status()).toBe('ready');
      expect(component.objectives()).toEqual(OBJECTIVES);
    });

    it('shows the save error and stays on the form when saving fails', () => {
      api.create.mockReturnValue(throwError(() => new Error('404')));

      form().submitted.emit(OBJECTIVES);
      refresh();

      expect(component.submitting()).toBe(false);
      expect(component.status()).toBe('empty');
      expect(el.querySelector('[role="alert"]')!.textContent).toContain(SAVE_ERROR);
    });

    it('falls back to the submitted values and reloads when the save returns no body', () => {
      api.create.mockReturnValue(of(null));
      api.get.mockReturnValue(of(OBJECTIVES));

      form().submitted.emit(OBJECTIVES);
      refresh();

      expect(api.get).toHaveBeenCalledTimes(2);
      expect(component.status()).toBe('ready');
      expect(component.objectives()).toEqual(OBJECTIVES);
    });
  });

  describe('editing objectives', () => {
    beforeEach(() => {
      api.get.mockReturnValue(of(OBJECTIVES));
      render();
      el.querySelector<HTMLButtonElement>('[aria-label="Editează obiectivele"]')!.click();
      refresh();
    });

    it('opens the edit dialog prefilled with the current objectives', () => {
      expect(dialog()).not.toBeNull();
      expect(form().initialValues()).toEqual(OBJECTIVES);
    });

    it('closes the dialog and shows the new goal after a successful update', () => {
      api.update.mockReturnValue(of(UPDATED));

      form().submitted.emit(UPDATED);
      refresh();

      expect(api.update).toHaveBeenCalledWith(UPDATED);
      expect(dialog()).toBeNull();
      expect(el.textContent).toContain(`din ${formatNumber(2400)} kcal`);
    });

    it('keeps the dialog open with an error when the update fails', () => {
      api.update.mockReturnValue(throwError(() => new Error('500')));

      form().submitted.emit(UPDATED);
      refresh();

      expect(dialog()).not.toBeNull();
      expect(dialog()!.querySelector('[role="alert"]')!.textContent).toContain(SAVE_ERROR);
      expect(component.objectives()).toEqual(OBJECTIVES);
    });

    it('clears the previous error when the dialog is reopened', () => {
      api.update.mockReturnValue(throwError(() => new Error('500')));
      form().submitted.emit(UPDATED);
      refresh();

      component.closeEdit();
      component.openEdit();
      refresh();

      expect(component.submitError()).toBeNull();
      expect(dialog()!.querySelector('[role="alert"]')).toBeNull();
    });
  });
});
