import {Component, Input} from '@angular/core';
import {Appointment} from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-item',
  templateUrl: './appointment-item.html',
  styleUrl: './appointment-item.css',
})

export class AppointmentItem {
  @Input({required: true}) appointment!: Appointment

  getFormattedTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  get timeRange(): string{
    const start = this.getFormattedTime(this.appointment.startDate);
    const end = this.getFormattedTime(this.appointment.endDate);
    return `${start} – ${end}`;
  }

}
