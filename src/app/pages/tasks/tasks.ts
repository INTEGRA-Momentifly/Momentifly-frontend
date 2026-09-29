import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskList } from '../../components/task-list/task-list';
import { Task } from '../../models/task';

@Component({
  imports: [RouterLink, TaskList],
  selector: 'app-tasks',
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks {
  tasks: Task[] = [
    {
      id: '1',
      userId: 'u1',
      description: 'Write report',
      dueDate: '2026-10-01',
      difficulty: 'HARD',
      completed: false,
    },
    {
      id: '2',
      userId: 'u1',
      description: 'Buy groceries',
      dueDate: '2026-09-30',
      difficulty: 'EASY',
      completed: false,
    },
  ];
}
