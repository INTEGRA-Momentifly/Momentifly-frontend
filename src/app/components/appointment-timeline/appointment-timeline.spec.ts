import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, Subject, of, throwError } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentTimelineComponent } from './appointment-timeline';

// "Today" is pinned to 3 Nov 2026. Dates are local-time strings without a zone,
// exactly like the backend sends them, so the tests do not depend on the time zone.
const TODAY = new Date(2026, 10, 3, 9, 0);

let nextId = 0;
function appointment(description: string, start: string, end: string): Appointment {
  return { id: `a${nextId++}`, userId: 'u1', description, startDate: start, endDate: end };
}

const day = (date: string, time: string) => `${date}T${time}:00`;

describe('AppointmentTimelineComponent', () => {
  let fixture: ComponentFixture<AppointmentTimelineComponent>;
  let component: AppointmentTimelineComponent;
  let el: HTMLElement;
  let service: { getAllAppointments: ReturnType<typeof vi.fn<() => Observable<Appointment[]>>> };

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(TODAY);
    service = { getAllAppointments: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AppointmentTimelineComponent],
      providers: [{ provide: AppointmentService, useValue: service }],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function render(appointments: Appointment[] | Observable<Appointment[]>): void {
    service.getAllAppointments.mockReturnValue(Array.isArray(appointments) ? of(appointments) : appointments);
    fixture = TestBed.createComponent(AppointmentTimelineComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  }

  const eventCount = () => el.querySelector('.event-count')!.textContent!.trim();
  const blocks = () => Array.from(el.querySelectorAll<HTMLElement>('.timeline-block'));
  const items = () => Array.from(el.querySelectorAll<HTMLElement>('.appointment-item'));

  describe('filtering and ordering', () => {
    it("shows only today's appointments", () => {
      render([
        appointment('Ieri', day('2026-11-02', '10:00'), day('2026-11-02', '11:00')),
        appointment('Azi', day('2026-11-03', '10:00'), day('2026-11-03', '11:00')),
        appointment('Mâine', day('2026-11-04', '10:00'), day('2026-11-04', '11:00')),
      ]);

      expect(component.appointments().map((a) => a.description)).toEqual(['Azi']);
      expect(eventCount()).toBe('1 evenimente');
    });

    it('sorts appointments by start time', () => {
      render([
        appointment('Seara', day('2026-11-03', '16:00'), day('2026-11-03', '17:00')),
        appointment('Dimineata', day('2026-11-03', '08:30'), day('2026-11-03', '09:00')),
        appointment('Pranz', day('2026-11-03', '12:00'), day('2026-11-03', '13:00')),
      ]);

      expect(component.appointments().map((a) => a.description)).toEqual(['Dimineata', 'Pranz', 'Seara']);
      expect(blocks().map((b) => b.textContent!.trim())).toEqual(['Dimineata', 'Pranz', 'Seara']);
    });

    it('shows an empty state when there is nothing today', () => {
      render([appointment('Ieri', day('2026-11-02', '10:00'), day('2026-11-02', '11:00'))]);

      expect(eventCount()).toBe('0 evenimente');
      expect(blocks()).toHaveLength(0);
      expect(items()).toHaveLength(0);
    });
  });

  describe('mapping', () => {
    it('calculates the start hour and the duration', () => {
      render([appointment('Review', day('2026-11-03', '10:30'), day('2026-11-03', '12:00'))]);

      const [apt] = component.appointments();
      expect(apt.startHourFloat).toBe(10.5);
      expect(apt.durationHours).toBe(1.5);
    });

    it('cycles through the four colours in order', () => {
      const times = ['08', '09', '10', '11', '12'];
      render(times.map((h) => appointment(`E${h}`, day('2026-11-03', `${h}:00`), day('2026-11-03', `${h}:30`))));

      expect(component.appointments().map((a) => a.colorName)).toEqual([
        'primary',
        'secondary',
        'tertiary',
        'alert',
        'primary',
      ]);
      expect(component.appointments()[0].colorBg).toBe('var(--accent-primary)');
    });
  });

  describe('signals and rendering', () => {
    const five = () =>
      ['08', '10', '12', '14', '16'].map((h) =>
        appointment(`Eveniment ${h}`, day('2026-11-03', `${h}:00`), day('2026-11-03', `${h}:30`)),
      );

    it('counts all events but lists at most three', () => {
      render(five());

      expect(component.totalEvents()).toBe(5);
      expect(component.listAppointments()).toHaveLength(3);
      expect(eventCount()).toBe('5 evenimente');
      expect(blocks()).toHaveLength(5);
      expect(items()).toHaveLength(3);
    });

    it('renders each list item with its colour class and duration', () => {
      render([appointment('Deep work', day('2026-11-03', '10:00'), day('2026-11-03', '12:00'))]);

      const [item] = items();
      expect(item.classList).toContain('color-primary');
      expect(item.querySelector('.description')!.textContent!.trim()).toBe('Deep work');
      expect(item.querySelector('.duration')!.textContent!.trim()).toBe('2h');
    });

    it('updates the view when the appointments arrive later', () => {
      const response = new Subject<Appointment[]>();
      render(response);
      expect(eventCount()).toBe('0 evenimente');

      response.next([appointment('Stand-up', day('2026-11-03', '09:00'), day('2026-11-03', '09:30'))]);
      fixture.detectChanges();

      expect(eventCount()).toBe('1 evenimente');
      expect(blocks().map((b) => b.textContent!.trim())).toEqual(['Stand-up']);
    });

    it('logs the error and shows an empty state when loading fails', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      render(throwError(() => new Error('offline')));

      expect(consoleError).toHaveBeenCalled();
      expect(eventCount()).toBe('0 evenimente');
    });
  });

  describe('getTimelineStyles', () => {
    function styles(start: string, end: string): Record<string, string> {
      render([appointment('X', day('2026-11-03', start), day('2026-11-03', end))]);
      return component.getTimelineStyles(component.appointments()[0]);
    }

    it('positions a block inside the 8:00–18:00 window', () => {
      expect(styles('10:00', '12:00')).toEqual({
        left: '20%',
        width: '20%',
        'background-color': 'var(--accent-primary)',
      });
    });

    it('clamps a block that starts before 8:00 to the left edge', () => {
      expect(styles('07:00', '09:00')['left']).toBe('0%');
    });

    it('does not let a block run past 18:00', () => {
      const result = styles('17:00', '19:00');
      expect(result['left']).toBe('90%');
      expect(result['width']).toBe('10%');
    });
  });

  describe('formatting', () => {
    beforeEach(() => render([]));

    it.each([
      [1, '1h'],
      [2, '2h'],
      [1.5, '1.5h'],
      [0.5, '30min'],
      [0.25, '15min'],
    ])('formatDuration(%s) is %s', (hours, expected) => {
      expect(component.formatDuration(hours)).toBe(expected);
    });

    it('formats times as HH:mm', () => {
      expect(component.formatTime('2026-11-03T09:05:00')).toBe('09:05');
    });
  });
});
