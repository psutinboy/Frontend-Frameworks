import { Component, OnInit, signal, inject } from '@angular/core';
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
export class TaskListComponent implements OnInit {
  public taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  currentFilter = this.taskService.currentFilter;

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

  loadTasks(): void {
    this.taskService.getTasks(this.currentFilter()).subscribe();
  }

  setFilter(filter: TaskFilter): void {
    this.taskService.getTasks(filter).subscribe();
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
        }
      });
    }
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe();
    }
  }

  toggleComplete(id: string): void {
    this.taskService.completeTask(id).subscribe();
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

