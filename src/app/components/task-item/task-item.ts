import { Component, Input } from '@angular/core';
import { Task } from '../../models/task';

@Component({
  imports: [],
  selector: 'app-task-item',
  styleUrl: './task-item.css',
  templateUrl: './task-item.html',
})
export class TaskItem {
  @Input() task!: Task;
}
