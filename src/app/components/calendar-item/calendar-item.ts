import {Component, inject} from '@angular/core';
import {Appointment} from '../../models/appointment.model';
import {AppointmentService} from '../../services/appointment.service';
import {CommonModule} from '@angular/common';
import {AppointmentItem} from '../appointment-item/appointment-item';
import {mockAppointments} from '../../appointment-calendar-mock';

@Component({
  imports: [CommonModule, AppointmentItem],
  selector:'app-appointment-calendar',
  templateUrl:'./calendar-item.html',
  styleUrl:'./calendar-item.css'
})

export class CalendarItem{

  appointments: Appointment[] = [];
  // appointments = mockAppointments;

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

}
