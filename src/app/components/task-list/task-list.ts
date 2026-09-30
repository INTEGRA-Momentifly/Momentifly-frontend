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
}
