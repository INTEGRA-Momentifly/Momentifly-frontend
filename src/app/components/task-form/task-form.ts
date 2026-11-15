
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, Difficulty } from '../../models/task.model';

//after authentnication change this to the current userId
const CURRENT_USER_ID = '550e8400-e29b-41d4-a716-446655440009';

export type CreateTaskRequest = Pick<
  Task,
  'userId' | 'description' | 'dueDate' | 'difficulty'
>;

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  styleUrl: './task-form.css',
  templateUrl: './task-form.html',
})
export class TaskForm {
  @Output() taskCreated = new EventEmitter<CreateTaskRequest>();

  @Output() formClosed = new EventEmitter<void>();

  closeForm(): void {
    this.formClosed.emit();
  }

  difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

  task = {
    description: '',
    dueDate: '',
    difficulty: 'MEDIUM' as Difficulty,
  };

  submitForm(): void {
    if (!this.task.description.trim() || !this.task.dueDate) {
      return;
    }

    this.taskCreated.emit({
      userId: CURRENT_USER_ID,
      description: this.task.description.trim(),
      dueDate: this.task.dueDate,
      difficulty: this.task.difficulty,
    });

    this.task = {
      description: '',
      dueDate: '',
      difficulty: 'MEDIUM',
    };
  }
}
