import { Component, computed, input } from '@angular/core';
import { TaskItem } from '../task-item/task-item';
import { Task } from '../../models/task.model';

@Component({
  imports: [TaskItem],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  tasks = input.required<Task[]>();

  pendingTasks = computed(() => this.tasks().filter((task) => !task.completed));

  completedTasks = computed(() => this.tasks().filter((task) => task.completed));
}
