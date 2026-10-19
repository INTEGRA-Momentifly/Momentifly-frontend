import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
  imports: [Checkbox, FormsModule],
  selector: 'app-task-item',
  styleUrl: './task-item.css',
  templateUrl: './task-item.html',
})
export class TaskItem {
  task = input.required<Task>();
  private datePipe = new DatePipe('en-GB');

  formatDueDate(dateValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);

    if (this.isToday(date)) {
      return 'AZI';
    }

    return this.datePipe.transform(date, 'mediumDate') ?? '';
  }

  formatDueTime(timeValue?: string) {
    if (!timeValue) {
      return '';
    }

    const [hours, minutes] = timeValue.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);

    return this.datePipe.transform(time, 'shortTime') ?? '';
  }

  isToday(date: Date) {
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }
}
