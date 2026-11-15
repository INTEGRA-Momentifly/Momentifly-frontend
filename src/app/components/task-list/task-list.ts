import { Component, computed, inject, input, output } from '@angular/core';
import { TaskItem } from '../task-item/task-item';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

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

  refreshNeeded = output<void>();

  private taskService = inject(TaskService);

  onTaskStatusChange(updatedTask: Task) {

    this.taskService.updateTaskStatus(updatedTask.id, updatedTask.completed).subscribe({
      next: () => {
        console.log(`Task-ul ${updatedTask.id} a fost actualizat cu succes.`);
        this.refreshNeeded.emit();
      },
      error: (err) => {
        console.error('Eroare la actualizarea statusului:', err);
      }
    });
}}
