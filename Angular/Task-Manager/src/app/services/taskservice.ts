import { computed, Injectable, signal } from '@angular/core';
import { Task, TaskStats } from '../Models/task';

// Sorting types
export type SortField = 'priority' | 'dueDate' | 'title' | 'createdAt' | 'completed';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

// Filter types
export interface FilterOptions {
  searchText?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  completed?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
@Injectable({
  providedIn: 'root',
})
export class Taskservice {
  // Private writable signal
  private tasksSignal = signal<Task[]>([]);

  // Public read-only signal
  tasks = this.tasksSignal.asReadonly();

  // Computed signals
  completedTasks = computed(() => this.tasks().filter((t) => t.completed));

  pendingTasks = computed(() => this.tasks().filter((t) => !t.completed));

  overdueTasks = computed(() => {
    const now = new Date();
    return this.tasks().filter((t) => !t.completed && t.dueDate && t.dueDate < now);
  });

  stats = computed<TaskStats>(() => ({
    total: this.tasks().length,
    completed: this.completedTasks().length,
    pending: this.pendingTasks().length,
    overdue: this.overdueTasks().length,
  }));

  constructor() {
    // Initialize with sample data
    this.loadSampleTasks();
  }

  // CRUD Operations
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasksSignal.update((tasks) => [...tasks, newTask]);
    return newTask;
  }

  updateTask(id: number, updates: Partial<Task>) {
    this.tasksSignal.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task))
    );
  }

  deleteTask(id: number) {
    this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  toggleTask(id: number) {
    this.tasksSignal.update((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
      )
    );
  }

  // Sorting Methods
  sortTasks(tasks: Task[], options: SortOptions): Task[] {
    const sorted = [...tasks];
    const { field, order } = options;

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (field) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;

        case 'dueDate':
          const aDate = a.dueDate?.getTime() ?? Infinity;
          const bDate = b.dueDate?.getTime() ?? Infinity;
          comparison = aDate - bDate;
          break;

        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;

        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;

        case 'completed':
          comparison = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  getSortedTasks(options: SortOptions): Task[] {
    return this.sortTasks(this.tasks(), options);
  }

  // Search and Filter Methods
  searchTasks(searchText: string): Task[] {
    if (!searchText.trim()) {
      return this.tasks();
    }

    const lowerSearch = searchText.toLowerCase();
    return this.tasks().filter(
      (task) =>
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description?.toLowerCase().includes(lowerSearch)
    );
  }

  filterTasks(options: FilterOptions): Task[] {
    let filtered = this.tasks();

    // Search by text
    if (options.searchText) {
      const lowerSearch = options.searchText.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearch) ||
          task.description?.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by priority
    if (options.priority) {
      filtered = filtered.filter((task) => task.priority === options.priority);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter((task) => options.tags!.some((tag) => task.tags?.includes(tag)));
    }

    // Filter by completion status
    if (options.completed !== undefined) {
      filtered = filtered.filter((task) => task.completed === options.completed);
    }

    // Filter by date range
    if (options.dateRange) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        return task.dueDate >= options.dateRange!.start && task.dueDate <= options.dateRange!.end;
      });
    }

    return filtered;
  }

  filterByPriority(priority: 'high' | 'medium' | 'low'): Task[] {
    return this.tasks().filter((task) => task.priority === priority);
  }

  filterByTag(tag: string): Task[] {
    return this.tasks().filter((task) => task.tags?.includes(tag));
  }

  filterByDateRange(start: Date, end: Date): Task[] {
    return this.tasks().filter((task) => {
      if (!task.dueDate) return false;
      return task.dueDate >= start && task.dueDate <= end;
    });
  }

  private loadSampleTasks() {
    const sampleTasks: Task[] = [
      {
        id: 1,
        title: 'Complete Angular Tutorial',
        description: 'Finish all modules of Angular 19 course',
        completed: false,
        priority: 'high',
        dueDate: new Date(2025, 10, 30),
        createdAt: new Date(2025, 10, 20),
        updatedAt: new Date(2025, 10, 20),
        tags: ['learning', 'angular'],
      },
      {
        id: 2,
        title: 'Build Portfolio Website',
        description: 'Create personal portfolio using Angular',
        completed: false,
        priority: 'medium',
        dueDate: new Date(2025, 11, 15),
        createdAt: new Date(2025, 10, 21),
        updatedAt: new Date(2025, 10, 21),
        tags: ['project', 'portfolio'],
      },
      {
        id: 3,
        title: 'Review TypeScript Basics',
        description: 'Go through TypeScript fundamentals',
        completed: true,
        priority: 'low',
        dueDate: null,
        createdAt: new Date(2025, 10, 18),
        updatedAt: new Date(2025, 10, 22),
        tags: ['learning', 'typescript'],
      },
    ];

    this.tasksSignal.set(sampleTasks);
  }
}
