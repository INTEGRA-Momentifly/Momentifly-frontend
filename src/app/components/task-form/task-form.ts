import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, Difficulty } from '../../models/task.model';

export type CreateTaskRequest = Pick<
  Task,
  'userId' | 'description' | 'dueDate' | 'difficulty'
>;

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.html'
})
export class TaskForm {
  @Output() taskCreated = new EventEmitter<CreateTaskRequest>();

  difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

  task: CreateTaskRequest = {
    userId: '',
    description: '',
    dueDate: '',
    difficulty: 'MEDIUM'
  };

  submitForm(): void {
    if (
      !this.task.userId ||
      !this.task.description.trim() ||
      !this.task.dueDate
    ) {
      return;
    }

    this.taskCreated.emit({
      ...this.task,
      description: this.task.description.trim()
    });

    this.task = {
      userId: '',
      description: '',
      dueDate: '',
      difficulty: 'MEDIUM'
    };
  }
}
