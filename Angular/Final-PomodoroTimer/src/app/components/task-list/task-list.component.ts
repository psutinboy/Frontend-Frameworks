import { Component, OnInit, signal, computed, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskFilter, CreateTaskRequest, UpdateTaskRequest } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, AfterViewInit {
  @ViewChild('taskListContainer') taskListContainer!: ElementRef<HTMLDivElement>;
  public taskService = inject(TaskService);
  currentFilter = this.taskService.currentFilter;
  
  // Computed signal that sorts tasks - completed to bottom when filter is 'all'
  tasks = computed(() => {
    const taskList = [...this.taskService.tasks()];
    if (this.currentFilter() === 'all') {
      return taskList.sort((a, b) => {
        // Completed tasks go to bottom
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        // Within same status, maintain order
        return 0;
      });
    }
    return taskList;
  });

  // Scroll gradient state
  showTopGradient = signal(false);
  showBottomGradient = signal(false);

  // Form state
  showAddForm = signal(false);
  editingTaskId = signal<string | null>(null);
  
  // Form fields
  taskTitle = signal('');
  taskDescription = signal('');
  estimatedPomodoros = signal(1);

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    // Check initial scroll state after view is initialized
    setTimeout(() => this.checkScrollGradients(), 0);
  }

  onScroll(): void {
    this.checkScrollGradients();
  }

  private checkScrollGradients(): void {
    if (!this.taskListContainer) return;

    const element = this.taskListContainer.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    const threshold = 20;

    // Show top gradient if scrolled down from top
    this.showTopGradient.set(scrollTop > threshold);

    // Show bottom gradient if there's more content below
    this.showBottomGradient.set(scrollTop < scrollHeight - clientHeight - threshold);
  }

  loadTasks(): void {
    this.taskService.getTasks(this.currentFilter()).subscribe({
      next: () => {
        // Check gradients after tasks are loaded
        setTimeout(() => this.checkScrollGradients(), 0);
      }
    });
  }

  setFilter(filter: TaskFilter): void {
    this.taskService.getTasks(filter).subscribe({
      next: () => {
        // Check gradients after filter changes
        setTimeout(() => this.checkScrollGradients(), 0);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm.update(value => !value);
    if (!this.showAddForm()) {
      this.resetForm();
    }
  }

  startEdit(task: Task): void {
    this.editingTaskId.set(task._id);
    this.taskTitle.set(task.title);
    this.taskDescription.set(task.description || '');
    this.estimatedPomodoros.set(task.estimatedPomodoros);
    this.showAddForm.set(false);
  }

  cancelEdit(): void {
    this.editingTaskId.set(null);
    this.resetForm();
  }

  onSubmit(): void {
    if (!this.taskTitle().trim()) {
      return;
    }

    const editingId = this.editingTaskId();
    
    if (editingId) {
      // Update existing task
      const request: UpdateTaskRequest = {
        title: this.taskTitle(),
        description: this.taskDescription(),
        estimatedPomodoros: this.estimatedPomodoros()
      };
      
      this.taskService.updateTask(editingId, request).subscribe({
        next: () => {
          this.resetForm();
          this.editingTaskId.set(null);
          setTimeout(() => this.checkScrollGradients(), 0);
        }
      });
    } else {
      // Create new task
      const request: CreateTaskRequest = {
        title: this.taskTitle(),
        description: this.taskDescription() || undefined,
        estimatedPomodoros: this.estimatedPomodoros()
      };
      
      this.taskService.createTask(request).subscribe({
        next: () => {
          this.resetForm();
          this.showAddForm.set(false);
          setTimeout(() => this.checkScrollGradients(), 0);
        }
      });
    }
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          setTimeout(() => this.checkScrollGradients(), 0);
        }
      });
    }
  }

  toggleComplete(id: string): void {
    this.taskService.completeTask(id).subscribe({
      next: () => {
        setTimeout(() => this.checkScrollGradients(), 0);
      }
    });
  }

  getProgressPercentage(task: Task): number {
    if (task.estimatedPomodoros === 0) return 0;
    return (task.completedPomodoros / task.estimatedPomodoros) * 100;
  }

  private resetForm(): void {
    this.taskTitle.set('');
    this.taskDescription.set('');
    this.estimatedPomodoros.set(1);
  }
}

