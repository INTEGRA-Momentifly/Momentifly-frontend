import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FitnessObjectives, Macros } from '../../models/objective.model';
import { EMPTY_MACROS } from '../../utils/objectives.utils';
import { formatNumber } from '../../utils/format';
import { MacrosCard } from './macros-card';

const OBJECTIVES: FitnessObjectives = { calories: 2000, protein: 150, carbohydrates: 200, fats: 67 };

describe('MacrosCard', () => {
  let fixture: ComponentFixture<MacrosCard>;
  let component: MacrosCard;
  let el: HTMLElement;

  function create(objectives: FitnessObjectives, consumed: Macros, consumedCalories: number): void {
    fixture = TestBed.createComponent(MacrosCard);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.componentRef.setInput('objectives', objectives);
    fixture.componentRef.setInput('consumed', consumed);
    fixture.componentRef.setInput('consumedCalories', consumedCalories);
    fixture.detectChanges();
  }

  const bars = () => Array.from(el.querySelectorAll<HTMLElement>('[role="progressbar"]'));
  const statValues = () => Array.from(el.querySelectorAll('.stat-value')).map((d) => d.textContent!.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MacrosCard] }).compileComponents();
  });

  it('renders a progress bar per macro with its target', () => {
    create(OBJECTIVES, { protein: 75, carbohydrates: 50, fats: 10 }, 590);

    expect(bars().map((b) => b.getAttribute('aria-valuemax'))).toEqual(['150', '200', '67']);
    expect(bars().map((b) => b.getAttribute('aria-valuenow'))).toEqual(['75', '50', '10']);
    expect(bars()[0].getAttribute('aria-valuetext')).toBe('75 din 150 grame');
    expect(el.textContent).toContain('75 / 150g');
    expect(el.textContent).toContain('50 / 200g');
  });

  it('calculates the fill percentage', () => {
    create(OBJECTIVES, { protein: 75, carbohydrates: 50, fats: 0 }, 500);

    expect(component.rows().map((r) => r.percent)).toEqual([50, 25, 0]);
  });

  it('caps the fill at 100%', () => {
    create(OBJECTIVES, { protein: 300, carbohydrates: 0, fats: 0 }, 1200);

    expect(component.rows()[0].percent).toBe(100);
  });

  it('shows 0% when a macro has no target', () => {
    create({ ...OBJECTIVES, fats: 0 }, { protein: 0, carbohydrates: 0, fats: 20 }, 180);

    expect(component.rows()[2].percent).toBe(0);
  });

  it('shows empty totals when nothing has been consumed', () => {
    create(OBJECTIVES, EMPTY_MACROS, 0);

    expect(statValues()).toEqual(['0kcal', '0g', '0g', '0g']);
  });

  it('formats the consumed totals', () => {
    create(OBJECTIVES, { protein: 120, carbohydrates: 180, fats: 60 }, 1740);

    expect(statValues()).toEqual([`${formatNumber(1740)}kcal`, '120g', '180g', '60g']);
  });
});
