import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskList } from '../../components/task-list/task-list';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  imports: [RouterLink, TaskList],
  selector: 'app-tasks',
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks {
  private taskService = inject(TaskService);
  tasks = signal<Task[]>([]);
  ngOnInit() {
    this.taskService.getAll().subscribe((tasks) => this.tasks.set(tasks));
  }
}
