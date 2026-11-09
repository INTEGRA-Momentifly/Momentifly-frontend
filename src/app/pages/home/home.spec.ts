import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: AppointmentService, useValue: { getAllAppointments: () => of([]) } }],
    }).compileComponents();
  });

  it('shows the appointment timeline in the right column', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    const timeline = el.querySelector('.right-column app-appointment-timeline');
    expect(timeline).not.toBeNull();
    expect(timeline!.textContent).toContain('Astăzi în calendar');
  });

  it('shows the calendar title only once (no leftover static card)', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    const titles = Array.from(el.querySelectorAll('h2')).filter((h) =>
      h.textContent!.includes('Astăzi în calendar'),
    );
    expect(titles).toHaveLength(1);
  });
});
