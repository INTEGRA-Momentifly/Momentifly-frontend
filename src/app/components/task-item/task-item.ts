import { Component, Input } from '@angular/core';
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
  @Input() task!: Task;

  formatDueDate(dateValue: string) {
    const date = new Date(`${dateValue}T00:00:00`);

    if (this.isToday(date)) {
      return 'AZI';
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
    };

    if (date.getFullYear() !== new Date().getFullYear()) {
      options.year = 'numeric';
    }

    return new Intl.DateTimeFormat('en-GB', options).format(date).toUpperCase();
  }

  formatDueTime(timeValue?: string) {
    return timeValue?.slice(0, 5) ?? '';
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
