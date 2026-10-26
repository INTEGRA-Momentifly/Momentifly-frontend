import {Component, inject} from '@angular/core';
import {Appointment} from '../../models/appointment.model';
import {AppointmentService} from '../../services/appointment.service';
import {CommonModule} from '@angular/common';
import {AppointmentItem} from '../appointment-item/appointment-item';

@Component({
  imports: [CommonModule, AppointmentItem],
  selector:'app-appointment-calendar',
  templateUrl:'./calendar-item.html',
  styleUrl:'./calendar-item.css'
})

export class CalendarItem{
  private appointmentService = inject(AppointmentService);

  currentView: 'day' | 'week' | 'month' = 'week';
  currentDate: Date = new Date();
  weekDays: { name: string; date: Date | null }[] = [];

  changeView(view: 'day' | 'week' | 'month') {
    this.currentView = view;
    this.loadAppointmentsForCurrentView();
  }

  loadAppointmentsForCurrentView(){
    let startDate: string;
    let endDate: string;

    if(this.currentView == 'day'){
      startDate = this.formatDate(this.currentDate, 'start');
      endDate = this.formatDate(this.currentDate, 'end');

      this.weekDays = [{
        name: `Ziua ${this.currentDate.getDate()}`,
        date: new Date(this.currentDate)
      }];
    } else if(this.currentView == 'week'){
      const weekRange = this.getWeekRange(this.currentDate);
      startDate = weekRange.start;
      endDate = weekRange.end;

      this.generateWeekDays(this.currentDate);
    } else {
      const monthRange = this.getMonthRange(this.currentDate);
      startDate = monthRange.start;
      endDate = monthRange.end;

      this.generateMonthDays(this.currentDate);
    }

    this.appointmentService.getAppointments(startDate, endDate).subscribe({
      next: (data) => this.appointments = data.map(app => ({
        ...app,
        startDate: new Date(app.startDate),
        endDate: new Date(app.endDate)
      })),
      error: (err) => console.error('Eroare la încărcarea programărilor:', err)
    })
  }

  getAppointmentsForTimeSlot(dayDate: Date | null, slot: 'dimineata' | 'amiaza' | 'seara'): Appointment[] {
    if(!dayDate) return [];
    return this.appointments.filter(app => {
      const appDate = new Date(app.startDate);

      const isSameDay =
        appDate.getFullYear() == dayDate.getFullYear() &&
        appDate.getMonth() == dayDate.getMonth() &&
        appDate.getDay() == dayDate.getDay();

      if(!isSameDay) return false;

      const hours = appDate.getHours();

      if(slot == 'dimineata') return hours >= 7 && hours < 12;
      if(slot == 'amiaza') return hours >= 12 && hours < 17;
      if(slot == 'seara') return hours >= 17 && hours < 22;

      return false;
    });
  }

  getAppointmentsForDay(dayDate: Date): Appointment[] {
    return this.appointments.filter(app => {
      const appDate = new Date(app.startDate);
      return appDate.getFullYear() === dayDate.getFullYear() &&
        appDate.getMonth() === dayDate.getMonth() &&
        appDate.getDate() === dayDate.getDate();
    });
  }

  getFormattedHeaderTitle(): string {
    if (this.currentView === 'month') {
      const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
      return this.currentDate.toLocaleDateString('ro-RO', options);
    }
    else if (this.currentView === 'day') {
      return "Mi-am propus astăzi..."
    }
    else {
      const validDays = this.weekDays.filter(d => d.date !== null);
      if (validDays.length === 0) return '';

      const startDate = validDays[0].date!;
      const endDate = validDays[validDays.length - 1].date!;

      const startDay = startDate.getDate();
      const startMonth = startDate.toLocaleDateString('ro-RO', { month: 'short' });

      const endDay = endDate.getDate();
      const endMonth = endDate.toLocaleDateString('ro-RO', { month: 'short' });
      const year = endDate.getFullYear();

      return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
    }
  }

  getShortDayName(date: Date | null): string {
    if(!date) return '';
    const days = ['DU', 'LU', 'MA', 'MI', 'JO', 'VI', 'SÂ'];
    return days[date.getDay()];
  }

  isCurrentDay(date: Date | null): boolean {
    if(!date) return false;
    const today = new Date('2026-09-30');
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  private generateWeekDays(referenceDate: Date) {
    const d = new Date(referenceDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(d.setDate(diff));
    this.weekDays = [];

    const dayNames = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

    for (let i = 0; i < 7; i++) {
      const currentDayDate = new Date(monday);
      currentDayDate.setDate(monday.getDate() + i);

      this.weekDays.push({
        name: `${dayNames[i]} ${currentDayDate.getDate()}`,
        date: currentDayDate
      });
    }
  }

  private generateMonthDays(referenceDate: Date) {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    this.weekDays = [];

    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    for (let i = 0; i < startingDayOfWeek; i++) {
      this.weekDays.push({
        name: '',
        date: null
      });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const currentDayDate = new Date(year, month, i);
      this.weekDays.push({
        name: `${i}`,
        date: currentDayDate
      });
    }
  }

  private formatDate(date: Date, type: 'start' | 'end'): string{
    const d = new Date(date);
    if(type == 'start') {
      d.setHours(0, 0, 0, 0);
    } else {
      d.setHours(23,59,59,999);
    }
    return d.toISOString();
  }

  private getWeekRange(date: Date){
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(d.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: this.formatDate(monday, 'start'),
      end: this.formatDate(sunday, 'end')
    };
  }

  private getMonthRange(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0);

    return {
      start: this.formatDate(firstDay, 'start'),
      end: this.formatDate(lastDay, 'end')
    };
  }

  appointments: Appointment[] = [
    {
      id: '1',
      userId: 'user-1',
      description: 'Stand-up echipă',
      startDate: new Date('2026-09-28T09:00:00'),
      endDate: new Date('2026-09-28T09:30:00')
    },
    {
      id: '2',
      userId: 'user-1',
      description: 'Deep work — Design',
      startDate: new Date('2026-09-28T10:00:00'),
      endDate: new Date('2026-09-28T12:00:00')
    },
    {
      id: '3',
      userId: 'user-1',
      description: 'Sync cu clientul',
      startDate: new Date('2026-09-29T09:30:00'),
      endDate: new Date('2026-09-29T10:30:00')
    },
    {
      id: '4',
      userId: 'user-1',
      description: 'Review PR',
      startDate: new Date('2026-09-29T13:00:00'),
      endDate: new Date('2026-09-29T14:00:00')
    },
    {
      id: '5',
      userId: 'user-1',
      description: 'Prânz cu echipa',
      startDate: new Date('2026-09-30T12:30:00'),
      endDate: new Date('2026-09-30T13:30:00')
    },
    {
      id: '6',
      userId: 'user-1',
      description: 'Design review Q4',
      startDate: new Date('2026-09-30T14:00:00'),
      endDate: new Date('2026-09-30T15:30:00')
    },
    {
      id: '7',
      userId: 'user-1',
      description: 'Alergare 5k',
      startDate: new Date('2026-09-30T18:00:00'),
      endDate: new Date('2026-09-30T19:00:00')
    },
    {
      id: '8',
      userId: 'user-1',
      description: 'Sprint planning',
      startDate: new Date('2026-10-01T09:00:00'),
      endDate: new Date('2026-10-01T11:00:00')
    },
    {
      id: '9',
      userId: 'user-1',
      description: 'Sesiune focus',
      startDate: new Date('2026-10-01T14:00:00'),
      endDate: new Date('2026-10-01T16:00:00')
    },
    {
      id: '10',
      userId: 'user-1',
      description: 'Demo client final',
      startDate: new Date('2026-10-02T10:00:00'),
      endDate: new Date('2026-10-02T11:30:00')
    },
    {
      id: '11',
      userId: 'user-1',
      description: 'Retrospectivă sprint',
      startDate: new Date('2026-10-02T15:00:00'),
      endDate: new Date('2026-10-02T16:00:00')
    },
    {
      id: '12',
      userId: 'user-1',
      description: 'Sală — upper body',
      startDate: new Date('2026-10-03T08:00:00'),
      endDate: new Date('2026-10-03T09:30:00')
    },
    {
      id: '13',
      userId: 'user-1',
      description: 'Check-in săptămânal',
      startDate: new Date('2026-10-03T17:30:00'),
      endDate: new Date('2026-10-03T18:30:00')
    },
    {
      id: '14',
      userId: 'user-1',
      description: 'Lectură tehnică',
      startDate: new Date('2026-10-26T10:00:00'),
      endDate: new Date('2026-10-26T12:00:00')
    }
  ];
}
