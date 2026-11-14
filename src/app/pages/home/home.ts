import { Component, LOCALE_ID, inject, signal, OnInit, computed } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { AppointmentTimelineComponent } from '../../components/appointment-timeline/appointment-timeline';
import { QuestList } from '../../components/quest-list/quest-list';
import { TaskList } from '../../components/task-list/task-list';

registerLocaleData(localeRo);

@Component({
  imports: [DatePipe, AppointmentTimelineComponent, QuestList, TaskList],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
  providers: [{ provide: LOCALE_ID, useValue: 'ro-RO' }],
})
export class Home implements OnInit {
  private taskService = inject(TaskService);
  tasks = signal<Task[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  today = new Date();

  ngOnInit() {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Nu s-au putut încărca task-urile.');
        this.loading.set(false);
      },
    });
  }

  todayTasks = computed(() => {
    const todayKey = this.toDateKey(new Date());
    return this.tasks().filter((task) => task.dueDate === todayKey);
  });

  private toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
