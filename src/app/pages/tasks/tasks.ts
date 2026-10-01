import { Component, inject, signal } from '@angular/core';
import { TaskList } from '../../components/task-list/task-list';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  imports: [TaskList],
  selector: 'app-tasks',
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks {
  private taskService = inject(TaskService);
  tasks = signal<Task[]>([]);
  loading = signal(true);
  ngOnInit() {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
    });
  }
}
