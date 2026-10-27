import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { AppointmentRequest } from '../models/appointment-request.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly API_URL = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.API_URL);
  }

  createAppointment(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.API_URL, request);
  }
}
