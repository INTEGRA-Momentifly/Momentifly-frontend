import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MacroDial } from './macro-dial';

describe('MacroDial', () => {
  let fixture: ComponentFixture<MacroDial>;
  let component: MacroDial;
  let slider: HTMLElement;
  let changes: ReturnType<typeof vi.fn<(value: number) => void>>;

  function create(inputs: Record<string, unknown> = {}): void {
    fixture = TestBed.createComponent(MacroDial);
    component = fixture.componentInstance;
    const defaults = { value: 100, min: 0, max: 400, accent: 'terracotta', labelId: 'protein-label' };
    for (const [name, value] of Object.entries({ ...defaults, ...inputs })) {
      fixture.componentRef.setInput(name, value);
    }
    changes = vi.fn();
    component.valueChange.subscribe(changes);
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('[role="slider"]');
  }

  function press(key: string, shiftKey = false): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, shiftKey, cancelable: true });
    slider.dispatchEvent(event);
    return event;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MacroDial] }).compileComponents();
  });

  it('exposes its value to assistive technology', () => {
    create();

    expect(slider.getAttribute('aria-valuenow')).toBe('100');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('400');
    expect(slider.getAttribute('aria-valuetext')).toBe('100 grame');
    expect(slider.getAttribute('aria-labelledby')).toBe('protein-label');
  });

  describe('keyboard', () => {
    beforeEach(() => create());

    it.each([
      ['ArrowUp', false, 101],
      ['ArrowRight', false, 101],
      ['ArrowDown', false, 99],
      ['ArrowLeft', false, 99],
      ['ArrowUp', true, 110],
      ['ArrowDown', true, 90],
      ['PageUp', false, 110],
      ['PageDown', false, 90],
      ['Home', false, 0],
      ['End', false, 400],
    ])('%s (shift: %s) emits %i', (key, shift, expected) => {
      const event = press(key, shift);

      expect(changes).toHaveBeenCalledWith(expected);
      expect(event.defaultPrevented).toBe(true);
    });

    it('ignores unrelated keys', () => {
      const event = press('a');

      expect(changes).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });
  });

  it('clamps emitted values to the range', () => {
    create({ value: 395 });
    press('PageUp');
    expect(changes).toHaveBeenCalledWith(400);

    create({ value: 5 });
    press('PageDown');
    expect(changes).toHaveBeenCalledWith(0);
  });

  it('does not emit when the value would not change', () => {
    create({ value: 400 });
    press('End');
    press('ArrowUp');

    expect(changes).not.toHaveBeenCalled();
  });

  it.each([
    ['readonly', { readonly: true }],
    ['disabled', { disabled: true }],
  ])('ignores input when %s', (_label, inputs) => {
    create(inputs);
    press('ArrowUp');

    expect(changes).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.knob')).toBeNull();
  });

  it('is removed from the tab order when disabled', () => {
    create({ disabled: true });
    expect(slider.getAttribute('tabindex')).toBe('-1');
  });

  describe('geometry', () => {
    it('maps min, middle and max to the ends and top of the 270° arc', () => {
      create({ value: 0 });
      expect(component.angle()).toBe(-135);
      expect(component.valuePath()).toBeNull();

      create({ value: 200 });
      expect(component.angle()).toBe(0);
      expect(component.valuePath()).not.toBeNull();

      create({ value: 400 });
      expect(component.angle()).toBe(135);
    });

    it('clamps out-of-range values for display', () => {
      create({ value: 500 });
      expect(component.clampedValue()).toBe(400);
      expect(slider.getAttribute('aria-valuenow')).toBe('400');
    });
  });

  describe('pointer', () => {
    function stubLayout(): void {
      slider.getBoundingClientRect = () => ({ left: 0, top: 0, width: 120, height: 120 }) as DOMRect;
      slider.setPointerCapture = vi.fn();
      slider.releasePointerCapture = vi.fn();
      slider.hasPointerCapture = vi.fn(() => true);
    }

    function pointer(type: string, clientX: number, clientY: number): void {
      const event = new MouseEvent(type, { clientX, clientY, bubbles: true, cancelable: true });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      slider.dispatchEvent(event);
      fixture.detectChanges();
    }

    it('sets the value from where the dial is pressed and dragged', () => {
      create({ value: 0 });
      stubLayout();

      pointer('pointerdown', 60, 0); // top centre = middle of the range
      expect(changes).toHaveBeenLastCalledWith(200);
      expect(component.dragging()).toBe(true);

      pointer('pointermove', 120, 60); // right edge = 90°, i.e. 225 of the 270° sweep
      expect(changes).toHaveBeenLastCalledWith(333);

      pointer('pointerup', 120, 60);
      expect(component.dragging()).toBe(false);
      expect(slider.releasePointerCapture).toHaveBeenCalledWith(1);
    });

    it('ignores pointer moves when not dragging', () => {
      create({ value: 0 });
      stubLayout();

      pointer('pointermove', 60, 0);

      expect(changes).not.toHaveBeenCalled();
    });

    it('ignores pointer input when readonly', () => {
      create({ value: 0, readonly: true });
      stubLayout();

      pointer('pointerdown', 60, 0);

      expect(changes).not.toHaveBeenCalled();
      expect(component.dragging()).toBe(false);
    });
  });
});
