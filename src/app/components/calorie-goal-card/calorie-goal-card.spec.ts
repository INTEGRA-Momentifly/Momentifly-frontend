import { ComponentFixture, TestBed } from '@angular/core/testing';
import { formatNumber } from '../../utils/format';
import { CalorieGoalCard } from './calorie-goal-card';

describe('CalorieGoalCard', () => {
  let fixture: ComponentFixture<CalorieGoalCard>;
  let component: CalorieGoalCard;
  let el: HTMLElement;

  function create(goal: number, consumed: number): void {
    fixture = TestBed.createComponent(CalorieGoalCard);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.componentRef.setInput('goal', goal);
    fixture.componentRef.setInput('consumed', consumed);
    fixture.detectChanges();
  }

  const ring = () => el.querySelector<HTMLElement>('.ring')!;
  const text = (selector: string) => el.querySelector(selector)!.textContent!.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CalorieGoalCard] }).compileComponents();
  });

  it('shows the full goal as remaining when nothing is consumed', () => {
    create(2000, 0);

    expect(text('.ring-value')).toBe(formatNumber(2000));
    expect(text('.ring-caption')).toBe('kcal rămase');
    expect(text('.consumed')).toBe(`0 din ${formatNumber(2000)} kcal`);
    expect(ring().getAttribute('aria-label')).toBe(
      `0 din ${formatNumber(2000)} kcal consumate, ${formatNumber(2000)} kcal rămase`,
    );
    expect(component.progress()).toBe(0);
    expect(component.dashOffset()).toBeCloseTo(component.circumference);
  });

  it('shows partial progress', () => {
    create(2000, 500);

    expect(text('.ring-value')).toBe(formatNumber(1500));
    expect(component.progress()).toBe(0.25);
    expect(ring().classList).not.toContain('over');
  });

  it('switches to the over-goal state when consumption exceeds the goal', () => {
    create(2000, 2300);

    expect(ring().classList).toContain('over');
    expect(text('.ring-value')).toBe(formatNumber(300));
    expect(text('.ring-caption')).toBe('kcal peste obiectiv');
    expect(ring().getAttribute('aria-label')).toContain(`Ai depășit obiectivul cu ${formatNumber(300)} kcal`);
  });

  it('caps the ring at a full circle', () => {
    create(2000, 5000);

    expect(component.progress()).toBe(1);
    expect(component.dashOffset()).toBe(0);
  });

  it('does not divide by zero when there is no goal', () => {
    create(0, 100);

    expect(component.progress()).toBe(0);
  });

  it('emits edit when the edit button is clicked', () => {
    create(2000, 0);
    const edit = vi.fn();
    component.edit.subscribe(edit);

    el.querySelector<HTMLButtonElement>('[aria-label="Editează obiectivele"]')!.click();

    expect(edit).toHaveBeenCalledOnce();
  });
});
