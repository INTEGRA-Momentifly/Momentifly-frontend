import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { TaskList } from '../../components/task-list/task-list';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ButtonDirective } from 'primeng/button';
import { TaskForm, CreateTaskRequest} from '../../components/task-form/task-form';

type SortOption = 'date' | 'difficulty';
type TaskFilter = 'all' | 'today' | 'week';

@Component({
  imports: [ButtonDirective, TaskList, TaskForm],
  selector: 'app-tasks',
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  tasks = signal<Task[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  sortBy = signal<SortOption>('date');
  sortMenuOpen = signal(false);
  activeView = signal<TaskFilter>('all');
  filterAnimating = signal(false);

  showTaskForm = signal(false);

  toggleTaskForm(): void {
    this.showTaskForm.update(value => !value);
  }

  createTask(request: CreateTaskRequest): void {
    this.errorMessage.set('');

    this.taskService.createTask(request).subscribe({
      next: (createdTask) => {
        this.tasks.update(tasks => [...tasks, createdTask]);
        this.showTaskForm.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to create task. Please try again.');
      },
    });
  }

  sortedTasks = computed(() => {
    const tasks = [...this.tasks()];

    if (this.sortBy() === 'difficulty') {
      const difficultyOrder = { HARD: 0, MEDIUM: 1, EASY: 2 };
      return tasks.sort(
        (first, second) => difficultyOrder[first.difficulty] - difficultyOrder[second.difficulty],
      );
    }

    return tasks.sort((first, second) => first.dueDate.localeCompare(second.dueDate));
  });
  visibleTasks = computed(() => {
    const view = this.activeView();

    if (view === 'all') {
      return this.sortedTasks();
    }

    const today = new Date();
    const todayKey = this.toDateKey(today);

    if (view === 'today') {
      return this.sortedTasks().filter((task) => task.dueDate === todayKey);
    }

    const day = today.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysFromMonday);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const startKey = this.toDateKey(weekStart);
    const endKey = this.toDateKey(weekEnd);

    return this.sortedTasks().filter((task) => task.dueDate >= startKey && task.dueDate <= endKey);
  });
  completedCount = computed(() => this.tasks().filter((task) => task.completed).length);

  ngOnInit() {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load tasks. Please try again later.');
        this.loading.set(false);
      },
    });
  }

  sortLabel = computed(() => (this.sortBy() === 'date' ? 'Dată' : 'Dificultate'));

  toggleSortMenu() {
    this.sortMenuOpen.update((isOpen) => !isOpen);
  }

  setSort(sort: SortOption) {
    this.sortBy.set(sort);
    this.sortMenuOpen.set(false);
  }

  setView(view: TaskFilter) {
    if (this.activeView() === view) {
      return;
    }

    this.activeView.set(view);
    this.filterAnimating.set(true);
    window.setTimeout(() => this.filterAnimating.set(false), 280);
  }

  private toDateKey(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
