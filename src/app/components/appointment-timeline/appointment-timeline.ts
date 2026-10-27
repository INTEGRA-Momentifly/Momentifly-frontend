import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { DatePipe } from '@angular/common';

interface MappedAppointment extends Appointment {
  startHourFloat: number;
  durationHours: number;
  colorName: string;
  colorBg: string;
}

@Component({
  selector: 'app-appointment-timeline',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './appointment-timeline.html',
  styleUrls: ['./appointment-timeline.css']
})
export class AppointmentTimelineComponent implements OnInit {
  appointments: any[] = [];
  listAppointments: any[] = [];
  totalEvents = 0;

  readonly START_HOUR = 8;
  readonly END_HOUR = 18;
  readonly TOTAL_HOURS = this.END_HOUR - this.START_HOUR;

  private readonly colors = [
    { name: 'primary', hex: 'var(--accent-primary)' },
    { name: 'secondary', hex: 'var(--accent-secondary)' },
    { name: 'tertiary', hex: 'var(--accent-tertiary)' },
    { name: 'alert', hex: 'var(--accent-alert)' }
  ];

  // Injectează AppointmentService în loc de HttpClient
  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {

        const today = new Date();

        const mapped = data
          .filter(apt => {
            const d = new Date(apt.startDate);
            return d.toDateString() === today.toDateString();
          })
          .map((apt, index) => {
            const start = new Date(apt.startDate);
            const end = new Date(apt.endDate);

            const startHourFloat = start.getHours() + (start.getMinutes() / 60);
            const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            const color = this.colors[index % this.colors.length];

            return {
              ...apt,
              startHourFloat,
              durationHours,
              colorName: color.name,
              colorBg: color.hex
            };
          })
          .sort((a, b) => a.startHourFloat - b.startHourFloat);

        this.appointments = mapped;
        this.totalEvents = mapped.length;
        this.listAppointments = mapped.slice(0, 3);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  getTimelineStyles(apt: MappedAppointment): Record<string, string> {
    const leftPct = ((apt.startHourFloat - this.START_HOUR) / this.TOTAL_HOURS) * 100;
    const widthPct = (apt.durationHours / this.TOTAL_HOURS) * 100;

    return {
      'left': `${Math.max(0, leftPct)}%`,
      'width': `${Math.min(100 - leftPct, widthPct)}%`,
      'background-color': apt.colorBg
    };
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDuration(hours: number): string {
    if (hours >= 1) {
      return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
    }
    return `${Math.round(hours * 60)}min`;
  }
}
