import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Appointment} from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService{
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/appointments';

  getAppointments(startDate?: string, endDate?: string): Observable<Appointment[]> {
    let params = new HttpParams();
    if (startDate && endDate) {
      params = params.set('startDate', startDate).set('endDate', endDate);
    }
    return this.http.get<Appointment[]>('/api/appointments', {params})
  }
}
