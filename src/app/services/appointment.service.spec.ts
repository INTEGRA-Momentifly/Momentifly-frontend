import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Appointment } from '../models/appointment.model';
import { AppointmentRequest } from '../models/appointment-request.model';
import { AppointmentService } from './appointment.service';

const API_URL = 'http://localhost:8080/api/appointments';

const APPOINTMENT: Appointment = {
  id: 'a1',
  userId: 'u1',
  description: 'Stand-up echipa',
  startDate: '2026-11-03T09:00:00',
  endDate: '2026-11-03T09:30:00',
};

describe('AppointmentService', () => {
  let service: AppointmentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AppointmentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getAllAppointments() GETs all appointments', () => {
    const result = vi.fn();
    service.getAllAppointments().subscribe(result);

    const req = http.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush([APPOINTMENT]);

    expect(result).toHaveBeenCalledWith([APPOINTMENT]);
  });

  it('createAppointment() POSTs the request and returns the created appointment', () => {
    const request: AppointmentRequest = {
      userId: 'u1',
      description: 'Stand-up echipa',
      startDate: '2026-11-03T09:00:00',
      endDate: '2026-11-03T09:30:00',
    };
    const result = vi.fn();
    service.createAppointment(request).subscribe(result);

    const req = http.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(APPOINTMENT);

    expect(result).toHaveBeenCalledWith(APPOINTMENT);
  });

  it('propagates server errors', () => {
    const error = vi.fn();
    service.getAllAppointments().subscribe({ error });

    http.expectOne(API_URL).flush('Boom', { status: 500, statusText: 'Server Error' });

    expect(error).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
  });
});
