import { Component, Input } from '@angular/core';
import { TaskItem } from '../task-item/task-item';
import { Task } from '../../models/task.model';

@Component({
  imports: [TaskItem],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  @Input() tasks: Task[] = [];

  get pendingTasks() {
    return this.tasks.filter((task) => !task.completed);
  }

  get completedTasks() {
    return this.tasks.filter((task) => task.completed);
  }
}
